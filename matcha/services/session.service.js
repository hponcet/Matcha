const MongoClient = require('mongodb').MongoClient
const conf = require('../config.js')
const log = require('./log.service')
const genToken = require('rand-token')
const tools = require('./tools.service')
const SESSION_TIME = conf.server.SESSION_TIME
const FREQ_SESSION_CONTROL = conf.server.FREQ_SESSION_CONTROL // 24h (msec)

function killSession (token) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      let sessions = db.collection('sessions')
      sessions.removeOne({'session.token': token})
      db.close()
    }
  })
}
function startSession (session) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      const sessions = db.collection('sessions')
      sessions.insertOne({ session: session }, function (err) {
        if (err) log.handleError(null, 'Failed to connect database.', err, 500)
      })
      db.close()
    }
  })
}
function getIdbyToken (token, callback) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      const sessions = db.collection('sessions')
      sessions.findOne({'session.token': token}, function (err, session) {
        if (err) {
          log.handleError(null, 'Failed to connect database.', err, 500)
        } else {
          callback(session.session.id)
        }
      })
      db.close()
    }
  })
}
function login (res, username, password, callback) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(res, 'Failed to connect database.', err.message, 500)
    } else {
      let users = db.collection('users')
      users.findOne({ 'mail': username }, function (err, user) {
        if (err) {
          log.handleError(res, 'Failed to connect database.', err.message, 500)
        } else {
          if (!user) {
            callback({
              authentified: false,
              reason: 1,
              message: 'Authentication failed. User not found.'
            })
          } else if (password !== user.password) {
            callback({
              authentified: false,
              reason: 2,
              message: 'Authentication failed. Wrong password.'
            })
          } else if (user.validation.account === false) {
            callback({
              authentified: false,
              reason: 3,
              message: 'Authentication failed. Account is not validated.'
            })
          } else {
            const sessionExpire = tools.newTimestamp() + SESSION_TIME * 1
            const token = genToken.generate(48)
            const authObj = {
              id: user._id,
              pseudo: user.pseudo,
              token: token,
              expire: sessionExpire
            }
            callback({
              message: 'Authenticated.',
              authentified: true,
              pseudo: user.pseudo,
              token: token,
              id: user._id,
              expire: sessionExpire
            })
            log.handleConsole('users', 'Logged. (' + user.pseudo + ')')
            return startSession(authObj)
          }
        }
      })
      db.close()
    }
  })
}
function logout (token) {
  killSession(token)
  log.handleConsole('users', 'Logout (' + token + ')')
}

function cleanSessions () {
  log.handleConsole('SERVER', 'Clean session in progress...')
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err.message, 500)
    } else {
      let sessions = db.collection('sessions')
      let date = tools.newTimestamp()

      sessions.find().toArray(function (err, allSessions) {
        if (err) {
          log.handleError(null, 'Failed to connect database.', err.message, 500)
        } else {
          let oldSessions = []

          for (let i = 0; i < sessions.length; i++) {
            if (allSessions[i].session.session.expire < date) {
              oldSessions.push(allSessions[i].session.token)
            }
          }
          return (
            function () {
              let i = 0
              for (i; i < oldSessions.length; i++) {
                killSession(oldSessions[i])
              }
              log.handleConsole('SERVER', i + ' sessions have been closed.')
            }
          )()
        }
      })
      db.close()
    }
  })
}

function killOldSessionDeamon (freq) {
  let freqControl = freq

  if (freqControl == null) {
    freqControl = FREQ_SESSION_CONTROL
  }
  log.handleConsole('SERVER', 'KillOldSessions process have been launch. Operations every ' + (freqControl / 1000) + 's.')
  cleanSessions()
  setInterval(() => {
    cleanSessions()
  }, freqControl)
}
function auth (res, id, token) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(conf.db.mongoURI, function (err, db) {
      if (err) {
        log.handleError(res, 'Failed to connect database.', err.message, 500)
        reject(err)
      } else {
        const objId = tools.validateObjectID(id)
        const sessions = db.collection('sessions')
        sessions.findOne({ 'session.id': objId, 'session.token': token }, function (err, session) {
          if (!session || err) {
            reject(err || null)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

module.exports = {
  killOldSessionDeamon,
  auth,
  login,
  logout,
  startSession,
  getIdbyToken
}
