'use strict';
var MissionFlown = require('../models/missionsFlown');
var urlHashController = require('../controllers/urlHash');
var Build = require('../models/shipBuild');
var events = require('../controllers/events');

var Squadron = function (startingData) {
    this.setDefaults();

    var loadedPromise;
    if (startingData) {
        loadedPromise = this.parseJson(startingData);
    } else {
        loadedPromise = Promise.resolve(this);
    }

    this.hasLoaded = loadedPromise.then(function (squadron) {
        events.trigger('model.squadron.ready', squadron);
        return squadron;
    });
};

Squadron.prototype.setDefaults = function () {
    this.name = '';
    this.missionsFlown = [];
    this.pilots = [];
};

Squadron.prototype.parseJson = function (json) {
    var self = this;

    this.name = json.name;

    this.missionsFlown = this.parseMissionJson(json);
    var parsedPilotsPromise = this.parsePilotsJson(json, this.missionsFlown);

    var loadCompletePromise = parsedPilotsPromise.then(function (pilotObjects) {
        // now assign all processed pilots to list
        self.pilots = pilotObjects;

        self.assignMissionPilots(json.missionPilots);
        self.assignPilotMissions(json.missionPilots);

        return self;
    });

    return loadCompletePromise;
};

Squadron.prototype.assignMissionPilots = function (missionPilots) {
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
    }
    return pilotMissions;
};

Squadron.prototype.parseMissionJson = function (json) {
    // Convert mission json into JS "class" object
    var missionsFlown = [];
    if (json.missions) {
        json.missions.forEach(function (missionJson) {
            var missionFlown = new MissionFlown(missionJson);
            missionsFlown.push(missionFlown);
        });
    }
    return missionsFlown;
};

Squadron.prototype.parsePilotsJson = function (json) {
    var self = this;
    // Convert pilot json into objects
    var pilotLoadPromises = [];
    if (json.pilots) {
        json.pilots.forEach(function (pilotJson) {
            var pilotObjectPromise = self.parsePilotJson(pilotJson);
            pilotLoadPromises.push(pilotObjectPromise);
        });
    }

    return Promise.all(pilotLoadPromises);
};

Squadron.prototype.parsePilotJson = function (pilotJson) {
    var decodePromise = urlHashController.parseExportStringToHistory(pilotJson.link);

    var pilotObject = {
        link: pilotJson.link
    };

    var pilotObjectPromise = decodePromise.then(function (decodedPilot) {
        var build = new Build(decodedPilot.xpHistory, decodedPilot.callsign, decodedPilot.playerName, decodedPilot.enemies, decodedPilot.equippedUpgrades, decodedPilot.equippedAbilities);
        pilotObject.build = build;
        pilotObject.imgUrl = '/components/xwing-data/images/' + build.currentShip.pilotCard.image;
        return pilotObject;
    });

    return pilotObjectPromise;
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
        });
    });

    return JSON.stringify(json);
};

Squadron.prototype.addPilot = function (url) {
    var self = this;
    var pilotJson = {
        link: url
    };
    var pilotObjectPromise = this.parsePilotJson(pilotJson);
    pilotObjectPromise.then(function (pilotObject) {
        self.pilots.push(pilotObject);
        events.trigger('model.squadron.pilots.add', self);
    });
};

Squadron.prototype.getVpTotals = function () {
    var totals = {
        rebel: 0,
        imperial: 0
    };
    this.missionsFlown.forEach(function (missionFlown) {
        totals.rebel += missionFlown.vps.rebel;
        totals.imperial += missionFlown.vps.imperial;
    });
    return totals;
};

module.exports = Squadron;
