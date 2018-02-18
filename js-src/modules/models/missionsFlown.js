'use strict';

var missionData = require('./missions');

var Mission = function (jsonData) {
    this.mission = missionData.getById(jsonData.missionId);
    this.date = new Date();
    this.date.setTime(jsonData.date);
    this.success = jsonData.success;

    this.vps = {
        rebel: 0,
        imperial: 0
    };
    if (jsonData.vps) {
        if (jsonData.vps.rebel) {
            this.vps.rebel = jsonData.vps.rebel;
        }
        if (jsonData.vps.imperial) {
            this.vps.rebel = jsonData.vps.imperial;
        }
    }
};

module.exports = Mission;

