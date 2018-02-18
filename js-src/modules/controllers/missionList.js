'use strict';

// var pilots = require('../data/pilots');
var templateUtils = require('../utils/templates');
// var missions = require('../models/missions');
var $ = require('jquery');

module.exports = {
    ready: function (squadron) {
        var $wrapperElement = $('[view-bind=mission-list]');

        var context = {
            missionsFlown: squadron.missionsFlown
        };
        templateUtils.renderToDom('mission-list', $wrapperElement, context);
    }
};
