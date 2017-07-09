const MongoClient = require('mongodb').MongoClient
const ObjectID    = require('mongodb').ObjectID
const conf        = require('../config.js')
const async        = require('async')
const session = require('./session.service')
const log  = require('./log.service')
const request = require('request-promise')
const tools = require('./tools.service')
const userInfoShared = {
  _id: 0,
  geoData: 0,
  ip: 0,
  validation: 0,
  password: 0
}

function validateObjectID (id) {
  const validate = ObjectID.isValid(id)
  if (validate) {
    return new ObjectID(id)
  } else {
    return false
  }
}

function getUserByToken (res, token, callback) {
  session.getIdbyToken(token, (id) => {
    getUserById(res, id, callback)
  })
}
function getUserById (res, origId, callback) {
  const id = validateObjectID(origId)
  if (!id) {
    log.handleError(null, '[WARNING]', 'Trying to falsify ObjectID.', 304)
    callback({
      status: '304',
      message: '[WARNING] Trying to falsify IDs.'
    })
  } else {
    MongoClient.connect(conf.db.mongoURI, function (err, db) {
      if (err) {
        log.handleError(res, 'Failed to find user.', err.message, 404)
      } else {
        const users = db.collection('users')
        users.findOne({ '_id': id }, userInfoShared, function (err, user) {
          if (err) {
            log.handleError(res, 'Failed to find user.', err.message, 404)
            callback({
              status: '401',
              data: null
            })
          } else {
            callback(user)
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
      log.handleError(res, 'Failed to connect db.', err.message)
    } else {
      var users = db.collection('users')
      users.find().toArray(function (err, result) {
        if (err) {
          log.handleError(res, 'Failed to connect db.', err.message)
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
          log.handleError(res, err.message, 'Failed to connect database.')
        } else {
          var users = db.collection('users')
          users.insertOne(dataUser, (err, doc) => {
            if (err) {
              log.handleError(res, err.message, 'Failed to insert user.')
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
      log.handleError(res, err.message, 'Failed to connect database.')
    } else {
      const users = db.collection('users')
      const regMail = '^' + mail + '$'
      users.findOne({'mail': {'$regex': regMail, $options: 'i'}}, (err, ret) => {
        if (err) {
          log.handleError(res, err.message, 'Failed to connect database.')
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
      log.handleError(res, err.message, "Failed to connect database.");
    } else {
      var users = db.collection('users')
      var regPseudo = '^'+pseudo+'$'
      users.findOne({'pseudo': {'$regex': regPseudo,$options: 'i' }}, (err, ret) => {
        if (ret == null) callback(false)
        else callback(true)
      })
      db.close()
    }
  })
}
function getCoord (id, callback) {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) log.handleError(null, err.message, 'Failed to connect database.')
    else {
      const users = db.collection('users')
      users.find({ _id: tools.validateObjectID(id) }, { loc: 1 }).toArray((err, coord) => {
        if (err) log.handleError(null, 'Failed to connect database.', err, 500)
        else {
          callback(coord[0].loc)
        }
      })
      db.close()
    }
  })
}

module.exports = {
  getUserByToken,
  getUserById,
  insertUser,
  getUsers,
  checkMail,
  checkPseudo,
  getCoord
}
