'use strict';
var MissionFlown = require('../models/missionsFlown');
var missionData = require('../data/missionsFlown');
var $ = require('jquery');
var urlHashController = require('../controllers/urlHash');
var Build = require('../models/shipBuild');

var Squadron = function (json) {
    this.hasLoaded = this.parseJson(json);
};

Squadron.prototype.parseJson = function (json) {
    var self = this;

    this.name = json.name;

    this.missionsFlown = this.parseMissonJson(json);
    var parsedPilotsPromise = this.parsePilotJson(json, this.missionsFlown);

    var loadCompletePromise = parsedPilotsPromise.then(function (pilotObjects) {
        // now assign all processed pilots to list
        self.pilots = pilotObjects;

        self.assignMissionPilots(json.missionPilots);
        self.assignPilotMissions(json.missionPilots);
    });

    return loadCompletePromise;
};

Squadron.prototype.assignMissionPilots = function (missionPilots, pilotObjects) {
    var self = this;

    // assign pilots to missions as well
    this.missionsFlown.forEach(function (missionFlown, index) {
        missionFlown.pilots = [];

        if (missionPilots[index]) {
            var pilotIndexes = missionPilots[index];
            pilotIndexes.forEach(function (pilotIndex) {
                var pilot = self.pilots[pilotIndex];
                missionFlown.pilots.push(pilot);
            });
        }
    });
};

Squadron.prototype.assignPilotMissions = function (missionPilots) {
    var self = this;
    var pilotMissions = this.getPilotMissions(missionPilots);

    this.pilots.forEach(function (pilot, pilotIndex) {
        pilot.missions = [];

        if (pilotMissions[pilotIndex]) {
            var missionIndexes = pilotMissions[pilotIndex];
            missionIndexes.forEach(function (missionIndex) {
                var mission = self.missionsFlown[missionIndex];
                pilot.missions.push(mission);
            });
        }
    });
};

Squadron.prototype.getPilotMissions = function (missionPilots) {
    // create reverse lookup of pilots to missions
    // key is pilot id, value is array of mission IDs
    var pilotMissions = {};
    for (var missionIndex in missionPilots) {

        var pilotIndexes = missionPilots[missionIndex];
        pilotIndexes.forEach(function (pilotIndex) {
            if (!pilotMissions[pilotIndex]) {
                pilotMissions[pilotIndex] = [];
            }
            pilotMissions[pilotIndex].push(missionIndex);
        });
    };
    return pilotMissions;
};

Squadron.prototype.parseMissonJson = function (json) {
    // Convert mission json into JS "class" object
    var missionsFlown = [];
    json.missions.forEach(function (missionJson) {
        var missionFlown = new MissionFlown(missionJson);
        missionsFlown.push(missionFlown);
    });
    return missionsFlown;
};

Squadron.prototype.parsePilotJson = function (json) {
    // Convert pilot json into objects
    var pilotLoadPromises = [];
    json.pilots.forEach(function (pilotJson) {
        var decodePromise = urlHashController.parseExportStringToHistory(pilotJson.link);

        var pilotObject = {
            link: pilotJson.link,
        };

        var pilotObjectPromise = decodePromise.then(function (decodedPilot) {
            var build = new Build(decodedPilot.xpHistory, decodedPilot.callsign, decodedPilot.playerName, decodedPilot.enemies, decodedPilot.equippedUpgrades, decodedPilot.equippedAbilities);
            pilotObject.build = build;
            pilotObject.imgUrl = '/components/xwing-data/images/' + build.currentShip.pilotCard.image;
            return pilotObject;
        });

        pilotLoadPromises.push(pilotObjectPromise);
    });

    return Promise.all(pilotLoadPromises);
};

Squadron.prototype.toJson = function () {
    return {};
};

module.exports = Squadron;
