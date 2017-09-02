const MongoClient = require('mongodb').MongoClient
const conf = require('../config.js')
const log = require('./log.service')

const getAllTags = (callback) => {
  MongoClient.connect(conf.db.mongoURI, (err, db) => {
    if (err) {
      log.handleError(null, 'Failed to connect database.', err, 500)
    } else {
      const tags = db.collection('tags')
      tags.find({}, {users: 0}).toArray((err, tags) => {
        if (err) log.handleError(null, 'Failed to connect database.', err, 500)
        else callback(tags)
      })
    }
  })
}

module.exports = {
  getAllTags
}
