'use strict';

var pilotListController = require('./pilotList');
var missionListController = require('./missionList');
var SquadronModel = require('../models/squadron');
var sampleData = require('../data/sampleData');
var urlHashController = require('../controllers/urlHash');

var squadron;

module.exports = {
    init: function () {
        var urlHash = urlHashController.get();
        urlHash = urlHash.replace('v1/', '');

        // squadron = new SquadronModel(sampleData);
        squadron = new SquadronModel(urlHash);
        console.log(squadron);

        squadron.hasLoaded.then(this.ready);
    },
    ready: function () {
        pilotListController.ready(squadron.pilots);
        missionListController.ready(squadron);

        var encodePromise = squadron.toCompressedString();
        encodePromise.then(function (encodedString) {
            urlHashController.set('v1/' + encodedString);
        });
    }
};
