const request = require('request')
const genToken = require('rand-token')
const Crypto = require('crypto-js//hmac-sha512')
const config = require('./config')
const session = require('./services/session.service')
const account = require('./services/account.service')
const location = require('./services/location.service')
const mailService = require('./services/mail.service')
const tools = require('./services/tools.service')

const express = require('express')
const router = express.Router()

router
.get('/citydb/dpts', (req, res) => {
  location.getDpts(res, function (result) {
    res.json(result)
  })
})
.get('/citydb/:dptnb', (req, res) => {
  location.getCity(res, req.params.dptnb, function (result) {
    res.json(result)
  })
})
.get('/api/citydb/:dptnb/:cityName', function (req, res) {
  location.getPCode(res, req.params.dptnb, req.params.cityName, function (result) {
    res.json(result)
  })
})
.get('/check/mail/:mail', (req, res) => {
  account.checkMail(res, req.params.mail, function (result) {
    res.json(result)
  })
})
.get('/check/pseudo/:pseudo', (req, res) => {
  account.checkPseudo(res, req.params.pseudo, function (result) {
    res.json(result)
  })
})
.get('/mail/:action/:token', (req, res) => {
  var data = tools.atob(req.params.token)
  var mail = data.split('|')[0]
  var token = data.split('|')[1]
  switch (req.params.action) {
    case 'validate':
      mailService.validateMail(mail, token, function (data) {
        res.json(data)
      })
      break
    case 'error':
      mailService.errorMail(mail, token)
      break
    default:
      break
  }
})
.post('/mail/:action/:token', (req, res) => {
  let mail = tools.atob(req.params.token)
  switch (req.params.action) {
    case 'resend':
      mailService.reSendMail(mail, (objUser) => {
        if (objUser !== null) {
          console.log(objUser)
          mailService.sendMail(res, objUser)
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
  req.body.password = Crypto(req.body.password, config.db.PSW_SALT).toString()
  req.body.validation = {
    'link': tools.btoa(req.body.mail + '|' + token),
    'token': token,
    'account': false
  }
  account.insertUser(res, req.body)
  mailService.sendMail(res, req.body)
})
.post('/login', (req, res) => {
  const username = req.body.username
  const password = Crypto(req.body.password, config.db.PSW_SALT).toString()
  session.login(res, username, password, function (auth) {
    res.json(auth)
  })
})
.post('/logout', (req, res) => {
  let token = req.body.token
  session.logout(token)
  res.json({message: 'Session closed.'})
})
.post('/auth', (req, res) => {
  const token = req.body.token
  session.auth(token)
    .then((authorized) => {
      if (authorized) {
        res.status(200).send({
          status: '200',
          message: 'OK',
          auth: true
        })
      } else {
        res.send({
          status: '401',
          message: 'Unauthorized',
          auth: false
        })
      }
    })
    .catch(() => {
      res.status(500).send({
        status: '500',
        message: 'Internal error',
        auth: false
      })
    })
})
.post('/profil', (req, res) => {
  const token = req.body.token
  account.getUserByToken(res, token, (user) => {
    res.json(user)
  })
})

module.exports = router
