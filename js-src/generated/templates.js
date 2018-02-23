module.exports = { "mission-list": function(obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul>\n    ';
 missionsFlown.forEach(function(missionFlown, missionIndex) { ;
__p += '\n        <li class="mission-list-item">\n            <div class="mission-header" click-toggle="mission-' +
((__t = ( missionIndex )) == null ? '' : __t) +
'">\n                <h3>' +
((__t = ( missionFlown.mission.name )) == null ? '' : __t) +
'</h3>\n                <p class="date">on: ' +
((__t = ( missionFlown.formattedDate )) == null ? '' : __t) +
'</p>\n                <span class="down-icon">▼</span>\n                <span class="up-icon">▲</span>\n            </div>\n            <div class="mission-content" toggle-target="mission-' +
((__t = ( missionIndex )) == null ? '' : __t) +
'">\n                <p>Outcome: ' +
((__t = ( missionFlown.success )) == null ? '' : __t) +
'</p>\n                <p>Rebel VPs: ' +
((__t = ( missionFlown.vps.rebel )) == null ? '' : __t) +
'</p>\n                <p>Imperial VPs: ' +
((__t = ( missionFlown.vps.imperial )) == null ? '' : __t) +
'</p>\n                <p>\n                    <strong>Pilots:</strong>\n                    ';
 missionFlown.pilots.forEach(function(pilot) { ;
__p += '\n                        ' +
((__t = ( pilot.build.callsign )) == null ? '' : __t) +
', \n                    ';
 }); ;
__p += '\n                </p>\n            </div>\n        </li>\n    ';
 }); ;
__p += '\n</ul>\n';

}
return __p
},"pilot-list": function(obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="pilot-list">\n    <ul>\n        ';
 pilotObjects.forEach(function(pilotObject, pilotIndex) { ;
__p += '\n            <li class="pilot-list-item" >\n                <div class="pilot-header" click-toggle="content-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                    <h3 class="callsign">' +
((__t = ( pilotObject.pilot.build.callsign )) == null ? '' : __t) +
'</h3>\n                    <h4 class="player-name">(' +
((__t = ( pilotObject.pilot.build.playerName )) == null ? '' : __t) +
')</h4>\n                    <p class="skill">Level: ' +
((__t = ( pilotObject.pilot.build.pilotSkill )) == null ? '' : __t) +
'</p>\n                    <p class="down-icon">▼</p>\n                    <p class="up-icon">▲</p>\n                </div>\n\n                <div class="pilot-content" toggle-target="content-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                    <div class="pilot-image">\n                        <div class="image-wrapper">\n                            <img src="https://hotac-ship-builder.netlify.com/' +
((__t = ( pilotObject.pilot.imgUrl )) == null ? '' : __t) +
'" />\n                        </div>\n                    </div>\n\n                    <p><a href="https://hotac-ship-builder.netlify.com/#/' +
((__t = ( pilotObject.pilot.link )) == null ? '' : __t) +
'" target="_blank">Link to build</a></p>\n\n                    <h5 click-toggle="enemies-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        <span>Enemies Destroyed: ' +
((__t = ( pilotObject.enemiesDestroyed )) == null ? '' : __t) +
'</span>\n                        <span class="down-icon">▼</span>\n                        <span class="up-icon">▲</span>\n                    </h5>\n                    <ul toggle-target="enemies-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        ';
 for (var xwsKey in pilotObject.pilot.build.enemyDefeats.enemyDefeats) { ;
__p += '\n                            <li>' +
((__t = ( xwsKey )) == null ? '' : __t) +
': ' +
((__t = ( pilotObject.pilot.build.enemyDefeats.enemyDefeats[xwsKey] )) == null ? '' : __t) +
'</li>\n                        ';
 } ;
__p += '\n                    </ul>\n\n                    <h5>Total XP earned: ' +
((__t = ( pilotObject.xpTotal )) == null ? '' : __t) +
'</h5>\n\n\n                    <h5 click-toggle="pilot-squadron-missions-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        <span>Squadron Missions: (' +
((__t = ( pilotObject.missionCounts.total )) == null ? '' : __t) +
')</span>\n                        <span class="down-icon">▼</span>\n                        <span class="up-icon">▲</span>\n                    </h5>\n                    <div toggle-target="pilot-squadron-missions-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        <h6>Success: ' +
((__t = ( pilotObject.missionCounts.success )) == null ? '' : __t) +
'</h6>\n                        <h6>Fail: ' +
((__t = ( pilotObject.missionCounts.fail )) == null ? '' : __t) +
'</h6>\n                        <ul>\n                            ';
 pilotObject.pilot.missions.forEach(function(missionFlown) { ;
__p += '\n                                <li>' +
((__t = ( missionFlown.mission.name )) == null ? '' : __t) +
'</li>\n                            ';
 }); ;
__p += '\n                        </ul>\n                    </div>\n\n                    <h5 click-toggle="pilot-missions-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        <span>Pilot Missions: (' +
((__t = ( pilotObject.missionCounts.pilotMissions )) == null ? '' : __t) +
')</span>\n                        <span class="down-icon">▼</span>\n                        <span class="up-icon">▲</span>\n                    </h5>\n                    <ul toggle-target="pilot-missions-' +
((__t = ( pilotIndex )) == null ? '' : __t) +
'">\n                        ';
 pilotObject.pilotMissions.forEach(function(mission) { ;
__p += '\n                            <li>' +
((__t = ( mission.name )) == null ? '' : __t) +
'</li>\n                        ';
 }); ;
__p += '\n                    </ul>\n                </div>\n            </li>\n        ';
 }); ;
__p += '\n    </ul>\n</div>\n';

}
return __p
} };