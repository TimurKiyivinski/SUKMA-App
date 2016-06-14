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
    const container = $('#container')[0]

    $.get(`${api}/highlight`, (response) => {
        const data = response.data
        data.data.forEach((highlight) => {
            Blaze.renderWithData(Template.highlight, highlight, container)
        })
    })
})
