'use strict';

var pilotListController = require('./pilotList');
var missionListController = require('./missionList');
var SquadronModel = require('../models/squadron');
var missionData = require('../data/missionsFlown');
var pilotData = require('../data/pilots');
var missionPilotData = require('../data/missionPilots');

var squadron;

module.exports = {
    init: function () {
        var json = this.getJson();
        squadron = new SquadronModel(json);
        console.log(squadron);

        squadron.hasLoaded.then(this.ready);
    },
    ready: function () {
        pilotListController.ready(squadron.pilots);
        missionListController.ready(squadron);
    },
    getJson: function () {
        var json = {
            name: 'Spectre Squadron',
            missions: missionData,
            pilots: pilotData,
            missionPilots: missionPilotData
        };
        return json;
    }
};
