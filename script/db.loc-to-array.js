

(function () {
  const _ = require('lodash')
  const MongoClient = require('mongodb').MongoClient
  const conf = require('../server.conf.js')

  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    const users = db.collection('users')
    users.find({}, {_id: 1, loc: 1}).toArray(function (err, data) {
      console.log(data)
      data.forEach((loc) => {
        if (loc.loc) {
          console.log(loc.loc)
          loc.loc = loc.loc.split(', ')
          loc.loc[0] = parseFloat(loc.loc[0])
          loc.loc[1] = parseFloat(loc.loc[1])
          users.findOneAndUpdate({_id: loc._id}, {$set: {loc:loc.loc}}, function(err, data) {
          // users.findOne({_id: loc._id}, function(err, data) {
            console.log(data)
          })
        }
      })
    })
  })
})()
