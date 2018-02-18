var $ = require('jquery');

module.exports = {
    getRoster: function (id) {
        var url = window.location.origin + '/roster/' + id + '.json';
        var getDataPromise = $.get(url);
        return getDataPromise;
    }
};
