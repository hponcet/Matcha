const request = require('request')
const conf = require("./server.conf.js")
const genToken = require("rand-token")
const sessManager = require('./tools/db.session-manager.js')
const accManager = require("./tools/db.account-manager.js")
const locManager = require("./tools/db.city-manager.js")
const mailManager = require("./tools/mail-manager.js")
const errManager = require("./tools/error-manager.js")
const tools = require("./tools/tools-manager.js")

const express = require('express')
const router = express.Router()

router
.get('/citydb/dpts', (req, res) => {
  locManager.getDpts(res, function (result) {
    res.json(result);
  })
})
.get('/citydb/:dptnb', (req, res) => {
  locManager.getCity(res, req.params.dptnb, function (result) {
    res.json(result);
  })
})
.get('/api/citydb/:dptnb/:cityName', function(req, res) {
  locManager.getPCode(res, req.params.dptnb, req.params.cityName, function (result) {
    res.json(result);
  })
})
.get('/ipinfo', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = '93.26.180.80'
  }
  const url = 'https://ipinfo.io/' + ip + '/json'
  request(url, { json: true }, (err, result, data) => {
    if (err) {
      console.log(err)
    } else {
      res.json(data)
    }
  })
})
.get('/ipinfo/:ip', (req, res) => {
  var ip = req.params.ip
  const url = 'https://ipinfo.io/' + ip + '/json'
  request(url, { json: true }, (err, result, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      res.json(data)
    }
  })
})
.get('/check/mail/:mail', (req, res) => {
  accManager.checkMail(res, req.params.mail, function (result) {
    res.json(result);
  })
})
.get('/check/pseudo/:pseudo', (req, res) => {
  accManager.checkPseudo(res, req.params.pseudo, function (result) {
    res.json(result);
  })
})
.get('/mail/:action/:token', (req, res) => {
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
.post('/mail/:action/:token', (req, res) => {
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
.post('/register', (req, res) => {
  const token = genToken.generate(16)
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = '93.26.180.80'
  }
  req.body.ip = ip
  req.body.validation = {
    'link': tools.btoa(req.body.mail + '|' + token),
    'token': token,
    'account': false
  }
  mailManager.sendMail(res, req.body)
  accManager.insertUser(res, req.body)
})
.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  sessManager.login(res, username, password, function (auth) {
    res.json(auth);
  }, sessManager.startSession)
})
.post('/logout', (req, res) => {
  let token = req.body.token
  sessManager.logout(token)
  res.json({message: "Session closed."})
})
.post('/profil',  (req, res) => {
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
