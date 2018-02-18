'use strict';

var $ = window.jQuery = require('jquery');
var pageController =  require('./modules/controllers/page');

var ready = function () {
    pageController.ready();
};

$(document).ready(ready);
