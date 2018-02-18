'use strict';

var $ = require('jquery');

module.exports = {
    render: function (squadron) {
        var $wrapperElement = $('[view-bind=squadron-name]');
        $wrapperElement.text(squadron.name);
    },
    reset: function () {
        var $wrapperElement = $('[view-bind=squadron-name]');
        $wrapperElement.text('');
    }
};

