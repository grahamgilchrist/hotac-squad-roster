var pilots = require('../data/pilots');
var templateUtils = require('../utils/templates');
var $ = require('jquery');

module.exports = {
    ready: function () {
        var $wrapperElement = $('[view-bind=pilot-list]');
        var context = {
            pilots: pilots
        };
        templateUtils.renderToDom('pilot-list', $wrapperElement, context);
    }
}
