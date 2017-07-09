const MongoClient = require('mongodb').MongoClient
const conf = require('../config.js')
const log = require('./log.service')

const findByKm = (originePoint, distance, callback) => {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      const users = db.collection('users')
      users.find({
        loc: {
          $geoWithin: {
            $centerSphere: [ originePoint, distance / 3963.2 ]
          }
        }
      }).toArray((err, matchedUsers) => {
        if (err) log.handleError(null, 'Failed to connect database.', err, 500)
        else callback(matchedUsers)
      })
      db.close()
    }
  })
}

module.exports = {
  findByKm
}
