var MongoClient = require('mongodb').MongoClient
var conf = require('../config.js')
var log = require('./log.service')

function getDpts (res, callback) {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      log.handleError(res, 'func getDpts: ' + err.message)
    } else {
      const citydb = db.collection('citydb')

      citydb.distinct('department', (err, result) => {
        if (err) {
          log.handleError(res, 'func getDpts: ' + err.messag)
        } else {
          callback(result)
        }
      })
      db.close()
    }
  })
}

function getCity (res, code, callback) {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      log.handleError(res, 'func getCity: ' + err.message)
    } else {
      const citydb = db.collection('citydb')
      const codeP = code.toString()

      citydb.distinct('name', {'department.number': codeP}, (err, ret) => {
        if (err) {
          log.handleError(res, 'func getCity: ' + err.message)
        } else {
          callback(ret.reverse())
        }
        db.close()
      })
    }
  })
}

function getPCode (res, code, cityName, callback) {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      log.handleError(res, 'func getPCode: ' + err.message)
    } else {
      const citydb = db.collection('citydb')
      const codeP = code.toString()

      citydb.distinct('postal_code', {'name': cityName, 'department.number': codeP}, (err, ret) => {
        if (err) {
          log.handleError(res, 'func getPCode: ' + err.message)
        } else {
          callback(ret.reverse())
        }
        db.close()
      })
    }
  })
}

module.exports = {
  getPCode,
  getCity,
  getDpts
}
