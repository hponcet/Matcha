const	express 	= require("express"),
		bodyParser 	= require("body-parser"),
		conf		= require("./server.conf.js"),
		genToken	= require("rand-token"),
		sessManager	= require('./tools/db.session-manager.js'),
		accManager 	= require("./tools/db.account-manager.js"),
		locManager 	= require("./tools/db.city-manager.js"),
		mailManager = require("./tools/mail-manager.js"),
		errManager = require("./tools/error-manager.js"),
		tools		= require("./tools/tools-manager.js"),
		request		= require('request'),
		app 		= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//  -- API services --  //
app.route('/api/citydb/dpts')
	.get(function(req, res) {
		locManager.getDpts(res, function (result) {
			res.json(result);
		})
	})
app.route('/api/citydb/:dptnb')
	.get(function(req, res) {
		locManager.getCity(res, req.params.dptnb, function (result) {
			res.json(result);
		})
	})
app.route('/api/citydb/:dptnb/:cityName')
	.get(function(req, res) {
		locManager.getPCode(res, req.params.dptnb, req.params.cityName, function (result) {
			res.json(result);
		})
	})
app.route('/api/ipinfo')
	.get(function(req, res) {
		var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress;

		if (ip == '::1' || ip == '127.0.0.1') // If server is in localhost
			ip = '163.172.250.13';
		request.get({ url:'https://ipinfo.io/'+ ip +'/json', json:true }, function (data) {
			res.json(data);
		})
	});
app.route('/api/check/mail/:mail')
	.get(function(req, res) {
		accManager.checkMail(res, req.params.mail, function (result) {
			res.json(result);
		})
	})
app.route('/api/check/pseudo/:pseudo')
	.get(function(req, res) {
		accManager.checkPseudo(res, req.params.pseudo, function (result) {
			res.json(result);
		})
	})
app.route('/api/mail/:action/:token')
  .get((req, res) => {
    var data = tools.atob(req.params.token)
    var mail = data.split('|')[0]
    var token = data.split('|')[1]

    console.log('yolo')
    switch (req.params.action) {
      case 'validate':
        mailManager.validateMail(mail, token, function (data) {
          res.json(data)
        })
        break
      case 'error':
        mailManager.errorMail(mail, token)
        break
      default:
        break
    }
  })
  .post((req, res) => {
    let mail = tools.atob(req.params.token)
    switch (req.params.action) {
      case 'resend':
        mailManager.reSendMail(mail, (objUser) => {
          if (objUser !== null) {
            console.log(objUser)
            mailManager.sendMail(res, objUser)
          }
        })
        break
      default:
        break
    }
  })
app.route('/api/register')
	.post(function(req, res) {
		var token = genToken.generate(16);
		req.body.validation = {
			'link': tools.btoa(req.body.mail + '|' + token),
			'token': token,
			'account': false
		}
		mailManager.sendMail(res, req.body)
		accManager.insertUser(res, req.body)
	})
app.route('/api/login')
	.post(function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		sessManager.login(res, username, password, function (auth) {
			res.json(auth);
		}, sessManager.startSession)
	})
app.route('/api/logout')
	.post(function(req, res) {
		let token = req.body.token
		sessManager.logout(token)
		res.json({message: "Session closed."})
	})
app.route('/api/profil')
  .post(function (req, res) {
    sessManager.auth(req.body.auth)
      .then(() => {
        let id = req.body.id
        accManager.getUserById(res, id, (profil) => {
          res.json(profil)
        })
      })
      .catch((err) => {
        res.json({
          status: '401',
          error: err
        })
      })
  })
app.all('/*', function (req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('/views/base.htm', { root: __dirname })
})

// Connect to the database before starting the application server.

let server = app.listen(conf.server['serverPort'], function () {
  var port = server.address().port
  errManager.handleConsole('server', 'App now running on port ' + port)

  sessManager.killOldSessionDeamon(conf.server.SESSION_TIME) // Deamon - Close old sessions every 24h
})
