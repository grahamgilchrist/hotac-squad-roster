'use strict';

// var pilots = require('../data/pilots');
var templateUtils = require('../utils/templates');
// var missions = require('../models/missions');
var $ = require('jquery');

module.exports = {
    ready: function (squadron) {
        var $wrapperElement = $('[view-bind=stats]');

        var context = {

        };
        templateUtils.renderToDom('stats', $wrapperElement, context);
    }
};
