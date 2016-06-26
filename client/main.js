import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'

import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'

import './main.html'

const api = 'https://sukmasarawak2016.my/v1'

Meteor.startup(() => {
    // Containers
    const container = $('#container')
    const containerHome = $('#container-home')
    const containerHighlight = $('#container-highlight')
    const containerSchedule = $('#container-schedule')
    const containerContingents = $('#container-contingents')
    const containerGallery = $('#container-gallery')
    const containerVisiting = $('#container-visiting')

    // Navigation links
    const navHome = $('#nav1')
    const navHighlight = $('#nav2')
    const navSchedule = $('#nav3')
    const navContigents = $('#nav4')
    const navGallery = $('#nav5')
    const navVisiting = $('#nav6')

    const highlight_click = (e, t) => {
        const target = $(e.target)
        if (target.is('a')) {
            window.open(target.attr('href'), '_system')
        } else {
            const body = target.parents('.panel-body-container')
            const compress = body.find('.panel-body-compress')
            const full = body.find('.panel-body-full')

            if (compress.hasClass('in')) {
                compress.removeClass('in')
                full.addClass('in')
            } else {
                full.removeClass('in')
                compress.addClass('in')
            }
        }
    }

    Template.gallery.helpers({
        destroy: () => {
            this.dom.remove()
        },
        configureHammer: () => {
            console.log('Configuring')
            return (hammer, t) => {
                hammer.get('pinch').set({
                    'enable': true
                })
                return hammer
            }
        },
        galleryGestures: {
            'pinchin img': (e, t) => {
                console.log('Triggered')
                const img = $(e.target)
                img.remove()
            }
        }
    })

    Template.gallery.events({
        'click img': (e, t) => {
            if (Meteor.isCordova) {
                cordova.plugins.fileOpener2.open(
                    $(e.target).attr('src'),
                    'image/jpg'
                )
            }
        }
    })

    Template.highlight_photo.events({
        'click .panel': highlight_click
    })

    Template.highlight.events({
        'click .panel': highlight_click
    })

    // Hide all contextual containers
    const hideContainers = () => $('.container-context').addClass('hidden')

    // Remove item instances
    const clear = (arg) => $(`#container-${arg}`).html('')

    // Returns current application context
    const context = () => container.data('context')

    // Update application states
    const update = {
        // Update synchronous lock state
        'unlocked': true,
        // Displays loading icon
        'loading': (enable) => {
            // TODO Create loading icon
            if (enable) {
                update.unlocked = false
                $('#btn-loading').removeClass('hidden')
            } else {
                update.unlocked = true
                $('#btn-loading').addClass('hidden')
            }
        },
        // Refreshes highlights
        'highlight': (url) => {
            $.get(url, (response) => {
                const data = response.data

                // Set pagination urls
                containerHighlight.data('next', data.next_page_url)
                containerHighlight.data('prev', data.prev_page_url)

                // Render each instance of highlight
                data.data.forEach((highlight) => {
                    highlight.min = highlight.data.replace(/(<([^>]+)>)/ig,"").substring(0, 64)
                    if (highlight.photos.length > 0) {
                        highlight.photo = highlight.photos[0].url
                        Blaze.renderWithData(Template.highlight_photo, highlight, containerHighlight[0])
                    } else {
                        Blaze.renderWithData(Template.highlight, highlight, containerHighlight[0])
                    }
                })

                // Remove loading icon
                update.loading(false)
            })
        },
        // Refreshes gallery
        'gallery': (url) => {
            $.get(url, (response) => {
                const data = response.data

                // Set pagination urls
                containerGallery.data('next', data.next_page_url)
                containerGallery.data('prev', data.prev_page_url)

                // Render each instance of highlight
                data.data.forEach((image) => {
                    Blaze.renderWithData(Template.gallery, image, containerGallery[0])
                })

                // Remove loading icon
                update.loading(false)
            })
        }
    }

    // Sets current application context
    const contextSet = {
        'home': () => {
            container.data('context', 'home')
            hideContainers()
            containerHome.removeClass('hidden')
        },
        'highlight': () => {
            container.data('context', 'highlight')
            hideContainers()
            containerHighlight.removeClass('hidden')

            update.highlight(`${api}/highlight`)
        },
        'schedule': () => {
            container.data('context', 'schedule')
            hideContainers()
            containerSchedule.removeClass('hidden')
        },
        'contingents': () => {
            container.data('context', 'contingents')
            hideContainers()
            containerContingents.removeClass('hidden')
        },
        'gallery': () => {
            container.data('context', 'gallery')
            hideContainers()
            containerGallery.removeClass('hidden')

            update.gallery(`${api}/photo`)
        },
        'visiting': () => {
            container.data('context', 'visiting')
            hideContainers()
            containerVisiting.removeClass('hidden')
        }
    }

    // Set navigation button actions
    navHome.click(() => contextSet.home())
    navHighlight.click(() => contextSet.highlight())
    navSchedule.click(() => contextSet.schedule())
    navContigents.click(() => contextSet.contingents())
    navGallery.click(() => contextSet.gallery())
    navVisiting.click(() => contextSet.visiting())

    $(window).scroll(() => {
        // Bottom
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if (context() == "highlight") {
                // If there is more news
                if (containerHighlight.data('next') != null && update.unlocked) {
                    // Display loading icon
                    update.loading(true)
                    // Update news with next url
                    update.highlight(`${containerHighlight.data('next')}`)
                }
            } else if (context() == "gallery")
                // If there is more photos
                if (containerGallery.data('next') != null && update.unlocked) {
                    // Display loading icon
                    update.loading(true)
                    // Update news with next url
                    update.gallery(`${containerGallery.data('next')}`)
                }
        }
    })

    contextSet.highlight()
})
