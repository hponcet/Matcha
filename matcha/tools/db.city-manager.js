var MongoClient = require('mongodb').MongoClient;
var conf        = require('../server.conf.js');
var errManager  = require('./error-manager');

exports.getDpts = function (res, callback) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            errManager.handleError(res, "func getDpts: " + err.message, err.message);
        } else {
            var citydb = db.collection('citydb');

            citydb.distinct("department", function(err, result) {
                if (err) {
                    errManager.handleError(res, "func getDpts: " + err.message, err.message);
                } else {
        	       callback(result);
                }
           });
            db.close();
        }
    });
};

exports.getCity = function (res, code, callback) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            throw err;

            errManager.handleError(res, "func getCity: " + err.message, err.message);
        } else {
            var citydb = db.collection('citydb');
            var codeP = code.toString();

            citydb.distinct("name", {"department.number":codeP}, function (err, ret){
                if (err) {
                    errManager.handleError(res, "func getCity: " + err.message, err.message);
                } else {
        	       callback(ret.reverse());
                }
                db.close();
            });
        }
    });
};

exports.getPCode = function (res, code, cityName, callback) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            throw err;

            errManager.handleError(res, "func getPCode: " + err.message, err.message);
        } else {
            var citydb = db.collection('citydb');
            var codeP = code.toString();

            citydb.distinct("postal_code", {"name":cityName, "department.number":codeP}, function (err, ret){
                if (err) {
                    errManager.handleError(res, "func getPCode: " + err.message, err.message);
                } else {
        	       callback(ret.reverse());
                }
                db.close();
            });
        }
    });
};
