'use strict';

var templateUtils = require('../utils/templates');
var missions = require('../models/missions');
var itemTypes = require('../models/shipBuild/itemTypes');
var $ = require('jquery');

module.exports = {
    render: function (pilotsList) {
        var $wrapperElement = $('[view-bind=pilot-list]');

        var pilotObjects = [];

        pilotsList.forEach(function (item) {
            var enemiesDestroyed = 0;
            var enemyDefeats = item.build.enemyDefeats.enemyDefeats;
            for (var xwsKey in enemyDefeats) {
                enemiesDestroyed += enemyDefeats[xwsKey];
            }

            var xpTotal = 0;
            item.build.xpHistory.forEach(function (xpItem) {
                if (xpItem.upgradeType === itemTypes.XP) {
                    xpTotal += xpItem.cost();
                }
            });

            var missionCounts = {
                total: 0,
                success: 0,
                fail: 0,
                pilotMissions: 0
            };

            missionCounts.total = item.missions.length;
            item.missions.forEach(function (missionFlown) {
                if (missionFlown.success === true) {
                    missionCounts.success += 1;
                } else {
                    missionCounts.fail += 1;
                }
            });

            var pilotMissions = [];
            item.build.xpHistory.forEach(function (xpItem) {
                if (xpItem.data.missionId) {
                    var mission = missions.getById(xpItem.data.missionId);
                    pilotMissions.push(mission);
                    missionCounts.pilotMissions += 1;
                }
            });

            var pilotObject = {
                pilot: item,
                enemiesDestroyed: enemiesDestroyed,
                xpTotal: xpTotal,
                missionCounts: missionCounts,
                pilotMissions: pilotMissions
            };
            pilotObjects.push(pilotObject);
        });

        var context = {
            pilotObjects: pilotObjects
        };
        templateUtils.renderToDom('pilot-list', $wrapperElement, context);
    }
};
