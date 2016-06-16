import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'

import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'

import './main.html'

const api = 'https://sukmasarawak2016.my/v1'

if (Meteor.isCordova) {
} else {
}

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
                console.log("Loading...")
            } else {
                update.unlocked = true
                console.log("Loading completed")
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
                    Blaze.renderWithData(Template.highlight, highlight, containerHighlight[0])
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
                containerGalley.data('prev', data.prev_page_url)

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

            update.gallery(`${api}/gallery`)
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
        // Top
        if ($(window).scrollTop() == 0) {
            if (context() == "highlight") {
                // If there is previous news
                if (containerHighlight.data('prev') != null && update.unlocked) {
                    // Display loading icon
                    update.loading(true)

                    // Clear highlights
                    clear.highlight()

                    // Update news with next url
                    update.highlight(`${containerHighlight.data('prev')}`)
                }
            }
        }
        // Bottom
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if (context() == "highlight") {
                // If there is more news
                if (containerHighlight.data('next') != null && update.unlocked) {
                    // Display loading icon
                    update.loading(true)

                    // Clear highlights
                    clear.highlight()

                    // Update news with next url
                    update.highlight(`${containerHighlight.data('next')}`)
                }
            }
        }
    })

    contextSet.highlight()
})
