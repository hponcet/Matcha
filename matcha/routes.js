var express = require('express');
var router = express.Router();

router
.get('/api/citydb/dpts', (req, res) => {
		locManager.getDpts(res, function (result) {
			res.json(result);
		})
	})
.get('/api/citydb/:dptnb', (req, res) => {
		locManager.getCity(res, req.params.dptnb, function (result) {
			res.json(result);
		})
	})
	.get('/api/citydb/:dptnb/:cityName', function(req, res) {
		locManager.getPCode(res, req.params.dptnb, req.params.cityName, function (result) {
			res.json(result);
		})
	})
.get('/api/ipinfo', (req, res) => {
		var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress;

		if (ip == '::1' || ip == '127.0.0.1') // If server is in localhost
			ip = '163.172.250.13';
		request.get({ url:'https://ipinfo.io/'+ ip +'/json', json:true }, function (data) {
			res.json(data);
		})
	});
.get('/api/check/mail/:mail', (req, res) => {
		accManager.checkMail(res, req.params.mail, function (result) {
			res.json(result);
		})
	})
.get('/api/check/pseudo/:pseudo', (req, res) => {
		accManager.checkPseudo(res, req.params.pseudo, function (result) {
			res.json(result);
		})
	})
.get('/api/mail/:action/:token', (req, res) => {
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
.post('/api/mail/:action/:token', (req, res) => {
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
.post('/api/register', (req, res) => {
		var token = genToken.generate(16);
		req.body.validation = {
			'link': tools.btoa(req.body.mail + '|' + token),
			'token': token,
			'account': false
		}
		mailManager.sendMail(res, req.body)
		accManager.insertUser(res, req.body)
	})
.post('/api/login', (req, res) => {
		var username = req.body.username;
		var password = req.body.password;
		sessManager.login(res, username, password, function (auth) {
			res.json(auth);
		}, sessManager.startSession)
	})
.post('/api/logout', (req, res) => {
		let token = req.body.token
		sessManager.logout(token)
		res.json({message: "Session closed."})
	})
.post('/api/profil',  (req, res) => {
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

module.exports = router
