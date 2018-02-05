'use strict';

var $ = window.jQuery = require('jquery');
var pilotListController = require('./modules/controllers/pilotList');

var ready = function () {
    pilotListController.ready();
};

$(document).ready(ready);
