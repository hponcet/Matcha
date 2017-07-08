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
function startSession (token) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      let sessions = db.collection('sessions')
      sessions.insertOne({'session': token}, function (error) {
        if (error) {
          log.handleError(null, 'Failed to connect database.', error, 500)
        }
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
      let sessions = db.collection('sessions')
      sessions.findOne({'session.token': token}, function (err, session) {
        if (err) {
          log.handleError(null, 'Failed to connect database.', err, 500)
        } else {
          if (!session) {
            callback(null)
          } else {
            callback(session.session.id)
          }
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
              authentificated: false,
              reason: 1,
              message: 'Authentication failed. User not found.'
            })
          } else if (password !== user.password) {
            callback({
              authentificated: false,
              reason: 2,
              message: 'Authentication failed. Wrong password.'
            })
          } else if (user.validation.account === false) {
            callback({
              authentificated: false,
              reason: 3,
              message: 'Authentication failed. Account is not validated.'
            })
          } else {
            console.log('db: ' + user.password)
            console.log('no: ' + password)
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
              authentificated: true,
              pseudo: user.pseudo,
              token: token,
              expire: sessionExpire
            })
            log.handleConsole('users', 'Logged. (' + user.pseudo + ')')
            startSession(authObj)
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
function auth (token) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(conf.db.mongoURI, function (err, db) {
      if (err) {
        log.handleError(null, 'Failed to connect database.', err.message, 500)
        reject(err)
      } else {
        const sessions = db.collection('sessions')
        sessions.findOne({ 'session.token': token }, function (err, session) {
          if (err) {
            reject(err)
          } else {
            if (session) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      }
    })
  })
}

function killOldSession () {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err.message, 500)
    } else {
      let sessions = db.collection('sessions')
      let date = tools.newTimestamp()

      sessions.find().toArray(function (err, sessions) {
        if (err) {
          log.handleError(null, 'Failed to connect database.', err.message, 500)
        } else {
          let oldSessions = []

          for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].session.expire < date) {
              oldSessions.push(sessions[i].session.token)
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
  let freqControl = freq || FREQ_SESSION_CONTROL
  const nextFreqControl = tools.secToTime(freqControl / 1000)
  const sessionTime = tools.secToTime(SESSION_TIME)

  log.handleConsole('SERVER', 'KillOldSessions process have been launch.')
  log.handleConsole('info', 'Next session\'s clean: ' + nextFreqControl)
  log.handleConsole('info', 'Sessions time: ' + sessionTime)
  killOldSession()
  setInterval(function () {
    log.handleConsole('SERVER', 'Clean session in progress...')
    killOldSession()
  }, freqControl)
}

module.exports = {
  login: login,
  logout: logout,
  auth: auth,
  killOldSessionDeamon: killOldSessionDeamon,
  getIdbyToken: getIdbyToken
}
