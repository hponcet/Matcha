const MongoClient = require('mongodb').MongoClient
const ObjectID    = require('mongodb').ObjectID
const conf        = require('../server.conf.js')
const async        = require('async')
const session = require('./db.session-manager')
const errManager  = require('./error-manager')
const request = require('request-promise')

function validateObjectID (id) {
  const validate = ObjectID.isValid(id)
  if (validate) {
    return new ObjectID(id)
  } else {
    return false
  }
}

function getUserByToken (res, token, callback) {
  session.getIdbyToken(token, (id) => { getUserById(res, id, callback) })
}
function getUserById (res, origId, callback) {
  const id = validateObjectID(origId)
  if (!id) {
    errManager.handleError(null, '[WARNING]', 'Trying to falsify ObjectID.', 304)
    callback({
      status: '304',
      message: '[WARNING] Trying to falsify IDs.'
    })
  } else {
    MongoClient.connect(conf.db.mongoURI, function (err, db) {
      // Check url integrity
      if (err) {
        errManager.handleError(res, 'Failed to find user.', err.message, 404)
      } else {
        const users = db.collection('users')
        users.findOne({ '_id': id }, function (err, user) {
          if (err) {
            errManager.handleError(res, 'Failed to find user.', err.message, 404)
            callback({
              status: '401',
              data: null
            })
          } else {
            callback({
              status: '200',
              data: user
            })
          }
        })
        db.close()
      }
    })
  }
}
function getUsers (res, callback) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
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
function insertUser (res, dataUser) {
  const options =
    {
      uri: 'https://ipinfo.io/' + dataUser.ip + '/json',
      json: true
    }
  request(options)
    .then((data) => {
      if (data.loc) {
        const loc = data.loc.split(',')
        dataUser.loc = []
        dataUser.loc[0] = parseFloat(loc[0])
        dataUser.loc[1] = parseFloat(loc[1])
      }
      dataUser.geoData = data
      dataUser.score = 0
      dataUser.matchs = 0
      MongoClient.connect(conf.db.mongoURI, (err, db) => {
        if (err) {
          errManager.handleError(res, err.message, 'Failed to connect database.')
        } else {
          var users = db.collection('users')
          users.insertOne(dataUser, (err, doc) => {
            if (err) {
              errManager.handleError(res, err.message, 'Failed to insert user.')
            } else {
              res.status(201).json(doc.ops[0])
            }
          })
          db.close()
        }
      })
    })
    .catch((err) => {
      console.log(err)
      return dataUser
    })
}
function checkMail (res, mail, callback) {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      errManager.handleError(res, err.message, 'Failed to connect database.')
    } else {
      const users = db.collection('users')
      const regMail = '^' + mail + '$'
      users.findOne({'mail': {'$regex': regMail, $options: 'i'}}, (err, ret) => {
        if (err) {
          errManager.handleError(res, err.message, 'Failed to connect database.')
        } else {
          if (ret == null) {
            callback(false)
          } else {
            callback(true)
          }
        }
      })
      db.close()
    }
  })
}
function checkPseudo (res, pseudo, callback) {
  MongoClient.connect(conf.db.mongoURI, function(err, db)
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

module.exports = {
  getUserByToken: getUserByToken,
  getUserById: getUserById,
  insertUser: insertUser,
  getUsers: getUsers,
  checkMail: checkMail,
  checkPseudo: checkPseudo
}
