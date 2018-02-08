'use strict';

var missionData = require('./missions');

var Mission = function (jsonData) {
    this.mission = missionData.getById(jsonData.missionId);
    this.date = new Date();
    this.date.setTime(jsonData.date);
};

module.exports = Mission;

