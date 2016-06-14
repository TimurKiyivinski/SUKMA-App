import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'

import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'

import './main.html'

//const api = 'http://sukmasarawak2016.my/v1'
const api = 'http://192.168.1.72:8000/v1'

if (Meteor.isCordova) {
} else {
}

Meteor.startup(() => {
    // Containers
    const container = $('#container')[0]
    const containerHighlight = $('#container-highlight')

    // Returns current application context
    const context = () => $('#container').data('context')

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
        }
    }

    // Remove item instances
    const clear = {
        'highlight': () => {
            $('.panel-highlight').remove()
        }
    }

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

    update.highlight(`${api}/highlight`)

})
