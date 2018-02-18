var templateUtils = require('../utils/templates');
var missions = require('../models/missions');
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

            var pilotObject = {
                pilot: item,
                enemiesDestroyed: enemiesDestroyed
            };
            pilotObjects.push(pilotObject);
        });

        var context = {
            pilotObjects: pilotObjects,
            missions: missions
        };
        templateUtils.renderToDom('pilot-list', $wrapperElement, context);
    }
};
