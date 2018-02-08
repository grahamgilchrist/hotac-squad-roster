'use strict';
var MissionFlown = require('../models/missionsFlown');
var missionData = require('../data/missionsFlown');
var $ = require('jquery');
var urlHashController = require('../controllers/urlHash');
var Build = require('../models/shipBuild');

// eslint-disable-next-line new-cap
var codec = window.JsonUrl('lzma');

var Squadron = function (startingData) {
    this.setDefaults();
    if (typeof startingData === 'string') {
        this.hasLoaded = this.parseCompressedString(startingData);
    } else if (startingData) {
        this.hasLoaded = this.parseJson(startingData);
    } else {
        // TODO: set immediatelhy resolved promise for this.hasloaded
        this.hasLoaded = true;
    }
};

Squadron.prototype.setDefaults = function () {
    this.name = '';
    this.missionsFlown = [];
    this.pilots = [];
}

Squadron.prototype.parseJson = function (json) {
    var self = this;

    this.name = json.name;

    this.missionsFlown = this.parseMissionJson(json);
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

Squadron.prototype.parseMissionJson = function (json) {
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
    var json = {
        name: this.name,
        missions: [],
        pilots: [],
        missionPilots: {}
    };

    this.pilots.forEach(function (pilot) {
        json.pilots.push({
            link: pilot.link
        });
    });

    this.missionsFlown.forEach(function (missionFlown, missionIndex) {
        json.missions.push({
            missionId: missionFlown.mission.id,
            date: missionFlown.date.getTime()
        });

        json.missionPilots[missionIndex] = [];
        missionFlown.pilots.forEach(function (pilot, pilotIndex) {
            json.missionPilots[missionIndex].push(pilotIndex);
        })
    });

    return JSON.stringify(json);
};

Squadron.prototype.toCompressedString = function () {
    var jsonString = this.toJson();
    return codec.compress(jsonString);
};

Squadron.prototype.parseCompressedString = function (compressedString) {
    var self = this;
    var decodePromise = codec.decompress(compressedString).then(function(jsonString) {
        var json = JSON.parse(jsonString);
        return self.parseJson(json);
    });
    return decodePromise;
};

module.exports = Squadron;
