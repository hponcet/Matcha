const request = require('request')
const genToken = require('rand-token')
const Crypto = require('crypto-js//hmac-sha512')
const config = require('./config')
const session = require('./services/session.service')
const account = require('./services/account.service')
const location = require('./services/location.service')
const mailService = require('./services/mail.service')
const tools = require('./services/tools.service')
const search = require('./services/search.service')
const log = require('./services/log.service')

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
.get('/citydb/:dptnb/:cityName', function (req, res) {
  location.getPCode(res, req.params.dptnb, req.params.cityName, function (result) {
    res.json(result)
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
      res.json(data)
    }
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
    case 'resend':
      mailService.reSendMail(data, (objUser) => {
        if (objUser !== null) {
          mailService.sendMail(res, objUser)
        } else {
          console.log('Can\'t find account for mailing.')
        }
      })
      break
    default:
      break
  }
})
.post('/search/km', (req, res) => {
  session.auth(res, req.body.id, req.body.token)
  .then(() => {
    account.getCoord(req.body.id, (coord) => {
      search.findByKm(coord, req.body.distance, (users) => {
        res.json(users)
      })
    })
  })
  .catch((err) => {
    console.log(err)
    res.json(null)
  })
})
.post('/auth', (req, res) => {
  session.auth(res, req.body.id, req.body.token)
  .then(() => {
    res.json(true)
  })
  .catch((err) => {
    console.log(err)
    res.json(false)
  })
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
.post('/profil', (req, res) => {
  const token = req.body.token
  account.getUserByToken(res, token, (user) => {
    res.json(user)
  })
})
.post('/users/id', (req, res) => {
  session.auth(res, req.body.id, req.body.token)
  .then(() => {
    account.getUserById(res, req.body.user, (user) => {
      res.json(user)
    })
  })
  .catch((err) => {
    console.log(err)
    res.json(null)
  })
})


module.exports = router
