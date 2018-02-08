var templateUtils = require('../utils/templates');
var missions = require('../models/missions');
var $ = require('jquery');

module.exports = {
    ready: function (pilotsList) {
        var $wrapperElement = $('[view-bind=pilot-list]');

        var context = {
            pilots: pilotsList,
            missions: missions
        };
        templateUtils.renderToDom('pilot-list', $wrapperElement, context);
    }
}
