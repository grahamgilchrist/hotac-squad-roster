'use strict';

var $ = require('jquery');
var events = require('./events');

var $newContent;
var $notFound;

module.exports = {
    ready: function () {
        $newContent = $('.new-content');
        $notFound = $('.not-found');
        $('#start').on('click', function () {
            var squadronName = $('#squadron-name').val();
            var data = {
                squadronName: squadronName
            };
            events.trigger('view.new.start', data);
        });
    },
    reset: function () {
        $('#squadron-name').val('');
    },
    show: function () {
        $newContent.removeClass('inactive');
        module.exports.hideNotFound();
    },
    hide: function () {
        $newContent.addClass('inactive');
    },
    showNotFound: function () {
        $notFound.removeClass('inactive');
    },
    hideNotFound: function () {
        $notFound.addClass('inactive');
    }
};
