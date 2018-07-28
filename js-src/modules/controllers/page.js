'use strict';

var missionListController = require('./missionList');
var statsController = require('./stats');
var SquadronModel = require('../models/squadron');
var urlHashController = require('../controllers/urlHash');
var httpController = require('../controllers/http');
var newView = require('../controllers/new');
var mainView = require('../controllers/main');
var headerView = require('../controllers/header');
var pilotListView = require('../views/pilotList');
var squadronNameView = require('../views/squadronName');
var events = require('../controllers/events');

var squadron;

module.exports = {
    ready: function () {
        module.exports.initialiseViews();
        module.exports.bindViewEvents();
        module.exports.bindModelEvents();

        var id = urlHashController.get();

        if (id && id.length > 0) {
            // We got an id in URL, so retrieve the roster
            var squadronDataPromise = httpController.getRoster(id);
            squadronDataPromise.then(module.exports.dataLoaded);
            squadronDataPromise.fail(function () {
                newView.show();
                newView.showNotFound();
            });
        } else {
            // No roster provided via URL, so show new build form
            newView.show();
        }
    },
    initialiseViews: function () {
        newView.ready();
        mainView.ready();
        headerView.ready();
    },
    dataLoaded: function (squadronData) {
        squadron = new SquadronModel(squadronData);
        squadron.hasLoaded.then(module.exports.squadronLoaded);
    },
    squadronLoaded: function () {
        newView.hide();
        mainView.show();
    },
    bindViewEvents: function () {
        events.on('view.header.reset', function () {
            newView.reset();
            mainView.hide();
            newView.show();
            squadronNameView.reset();
        });
        events.on('view.new.start', function (event, data) {
            var squadronData = {
                name: data.squadronName
            };
            squadron = new SquadronModel(squadronData);
            squadron.hasLoaded.then(module.exports.squadronLoaded);
            newView.hide();
            mainView.show();
        });

        events.on('view.main.addPilot', function (event, data) {
            squadron.addPilot(data.url);
        });

    },
    bindModelEvents: function () {
        events.on('model.squadron.ready', function (event, squadron) {
            pilotListView.render(squadron);
            missionListController.ready(squadron);
            statsController.ready(squadron);
            squadronNameView.render(squadron);
            mainView.renderVps(squadron);
        });

        events.on('model.squadron.pilots.add', function (event, squadron) {
            pilotListView.render(squadron);
        });

    }
};
