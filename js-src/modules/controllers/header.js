'use strict';

var $ = require('jquery');
var events = require('./events');

module.exports = {
    ready: function () {
        $('.new-roster').on('click', function () {
            events.trigger('view.header.reset');
        });
    }
};
