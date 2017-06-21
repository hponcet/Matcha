const	express = require("express")
const bodyParser = require("body-parser")
const conf = require("./server.conf.js")
const	sessManager	= require('./tools/db.session-manager.js')
const	errManager = require("./tools/error-manager.js")
const app = express()
const routes = require('./routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.use('/api', routes)


app.all('/*', function (req, res, next) {
  res.sendFile('/views/base.html', { root: __dirname })
})
app.all('/dist/app.bundle.js', function (req, res, next) {
	  res.sendFile('/public/dist/app.bundle.js', { root: __dirname })
	})


// Connect to the database before starting the application server.

let server = app.listen(conf.server['serverPort'], () => {
  let port = server.address().port
  errManager.handleConsole('server', 'App now running on port ' + port)
  sessManager.killOldSessionDeamon(conf.server.SESSION_TIME) // Deamon - Close old sessions every 24h
})
