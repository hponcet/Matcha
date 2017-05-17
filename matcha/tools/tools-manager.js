// btoa and atob functions for NodeJs server
exports.btoa = require("btoa");
exports.atob = require("atob");

// return a timestamp
exports.newTimestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};
