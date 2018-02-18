'use strict';

var $ = require('jquery');
var events = require('../controllers/events');

var $mainContent;

module.exports = {
    ready: function () {
        $mainContent = $('.main-content');
        $('#add-pilot').on('click', module.exports.addPilot);
    },
    show: function () {
        $mainContent.removeClass('inactive');
    },
    hide: function () {
        $mainContent.addClass('inactive');
    },
    addPilot: function () {
        var data = {
            url: $('#new-pilot-url').val()
        };
        events.trigger('view.main.addPilot', data);
    },
    renderVps: function (squadron) {
        var vps = squadron.getVpTotals();
        $('#rebel-vps').text(vps.rebel);
        $('#imperial-vps').text(vps.imperial);
    }
};
