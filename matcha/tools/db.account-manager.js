const MongoClient = require('mongodb').MongoClient;
const ObjectID    = require('mongodb').ObjectID;
const conf        = require('../server.conf.js');
const errManager  = require('./error-manager');


// Some usefull function
function validateObjectID(OI) {
    var reg = /^[0-9a-f]{24}$/;
    let str = OI + ''
    if (str.match(reg)) {
        return true;
    } else {
        return false;
    }
};
// Search an user by ObjectID
exports.getUserById = function (res, id, callback) {
  if (validateObjectID(id) === false) {
    errManager.handleError(null, '[WARNING]', 'Trying to falsify ObjectID.', 304)
    callback({
      status: '304',
      message: '[WARNING] Trying to falsify ObjectID.'
    })
  } else {
    MongoClient.connect(conf.db.mongoURL, function (err, db) {
      // Check url integrity
      if (err) {
        errManager.handleError(res, 'Failed to find user.', err.message, 404)
      } else {
        var users = db.collection('users')
        var OID = new ObjectID(id)

        users.findOne({ '_id': OID }, function (err, data) {
          if (err) {
            errManager.handleError(res, 'Failed to find user.', err.message, 404)
          } else {
            callback({
              status: '200',
              data: data
            })
          }
        })
        db.close()
      }
    })
  }
}
// Get all users
exports.getUsers = function (res, callback) {
  MongoClient.connect(conf.db.mongoURL, function (err, db) {
    if (err) {
      errManager.handleError(res, 'Failed to connect db.', err.message)
    } else {
      var users = db.collection('users')
      users.find().toArray(function (err, result) {
        if (err) {
          errManager.handleError(res, 'Failed to connect db.', err.message)
        } else {
          callback(result)
        }
      })
      db.close()
    }
  })
}
// Insert new user
exports.insertUser = function(res, dataUser) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            errManager.handleError(res, err.message, "Failed to connect database.");
        } else {
            var users = db.collection('users');
            users.insertOne(dataUser, function(err, doc) {
                res.status(201).json(doc.ops[0]);
            });
            db.close();
        }
    });
};
// Check if mail exist
exports.checkMail = function(res, mail, callback) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            errManager.handleError(res, err.message, "Failed to connect database.");
        } else {
            var users = db.collection('users');
            var regMail = '^'+mail+'$';
            users.findOne({"mail": {'$regex': regMail,$options:'i'}}, function(err, ret) {
                if (ret == null)
                    callback(false);
                else
                    callback(true);
            });
            db.close();
        }
    });
};
// Check if pseudo exist
exports.checkPseudo = function(res, pseudo, callback) {
    MongoClient.connect(conf.db.mongoURL, function(err, db)
    {
        if (err) {
            errManager.handleError(res, err.message, "Failed to connect database.");
        } else {
            var users = db.collection('users');
            var regPseudo = '^'+pseudo+'$';
            users.findOne({"pseudo": {'$regex': regPseudo,$options:'i'}}, function(err, ret) {
                if (ret == null)
                    callback(false);
                else
                    callback(true);
            });
            db.close();
        }
    });
};
