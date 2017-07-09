(function () {
  const _ = require('lodash')
  const MongoClient = require('mongodb').MongoClient
  const conf = require('../matcha/config.js')

  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) console.log('[error]', err)
    const users = db.collection('users')
    users.find({}, {_id: 1, loc: 1}).toArray(function (err, data) {
      if (err) console.log('[error]', err)
      data.forEach((loc) => {
        if (loc.loc && _.isArray(loc.loc) === false) {
          console.log(loc.loc)
          loc.loc = loc.loc.split(', ')
          loc.loc[0] = parseFloat(loc.loc[0])
          loc.loc[1] = parseFloat(loc.loc[1])
          users.findOneAndUpdate({_id: loc._id}, {$set: {loc: loc.loc}}, function (err, data) {
            if (err) console.log('[error]', err)
            console.log(data.loc)
          })
        }
      })
    })
    users.createIndex({loc: '2d'})
  })
})()
