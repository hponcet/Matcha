const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const conf = require('./config.js')
const	session	= require('./services/session.service.js')
const	errManager = require('./services/log.service.js')
const app = express()
const routes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')))
app.use('/api', routes)

app.all('/*', function (req, res, next) {
  res.sendFile('/index.html', { root: __dirname })
})
app.all('/dist/app.bundle.js', function (req, res, next) {
  res.sendFile('/public/dist/app.bundle.js', { root: __dirname })
})

let server = app.listen(conf.server['serverPort'], () => {
  const port = server.address().port
  errManager.handleConsole('server', 'App now running on port ' + port)
  session.killOldSessionDeamon() // Deamon - Close old sessions every 24h
})
