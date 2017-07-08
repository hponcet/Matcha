const nodemailer = require('nodemailer')
const MongoClient = require('mongodb').MongoClient
const conf = require('../config.js')
const errManager = require('./log.service')

exports.sendMail = function (res, userObj) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hponcet.projects@gmail.com',
      pass: 'MonMotDePasse'
    }
  })
  var hostAddr = conf.server['hostAddr']
  var inscriptionMail = {
    subject: 'Bienvenue sur Matcha !',
    to: userObj.mail,
    html: '<meta charset="utf-8"/> \
    <body style="background-color: #EDEDED; font-family: Trebuchet MS; color: #606060;"> \
    <center> \
    <div style="width: 450px;">\
    <p><h2>Bienvenue ' + userObj.fn + ' !</h2></p>\
    <hr style="background-color: darkgrey;"/>\
    <div style="text-align: justify;">\
    <br>\
    <p>Nous somment heureux de te compter parmis nous.\
    Nous ésperons que tu ferras de belles rencontres (et peut-être même l\'âme soeur)?</p>\
    <p>N\'oublies pas de bien remplir ton profil pour que les autres matcheurs et matcheuses trouvent en toi le compagnon parfait.</p>\
    <br>\
    <p>Pour valider ton compte il te suffit de cliquer sur <a href="' + hostAddr + 'mail/validate/' + userObj.validation.link + '">ce lien</a>.</p>\
    <br>\
    <p>À très vite sur le site ;-)</p>\
    <br>\
    <br>\
    </div>\
    <em style="font-size: 12px">Si cet e-mail ne vous ai pas déstiné, merci de \
    cliquer sur <a href="' + hostAddr + 'mail/error/' + userObj.validation.link + '">ce lien</a>.</em>\
    </div>\
    </center>\
    </body>',
    text: 'Bienvenue ' + userObj.fn + ' !\n\
    \n\
    Nous somment heureux de te compter parmis nous.\n\
    Nous ésperons que tu ferras de belles rencontres (et peut-être même l\'âme soeur)?\n\
    N\'oublies pas de bien remplir ton profil pour que les autres matcheurs et matcheuses trouventw en toi le compagnon parfait.\n\
    \n\
    Pour valider ton compte il te suffit de cliquer sur ce lien :\n\
    ' + hostAddr + 'mail/validate/' + userObj.validation.link + '.\n\
    \n\
    À très vite sur le site ;-)\n\
    \n\
    Si cet e-mail ne vous ai pas déstiné, merci de cliquer sur ce lien :\n\
    ' + hostAddr + 'mail/error/' + userObj.validation.link + '.\n'
  }

  let mailOptions = {
    from: '"Matcha" <hponcet.projects@gmail.com>', // sender address
    to: inscriptionMail.to,
    subject: inscriptionMail.subject, // Subject line
    text: inscriptionMail.text, // plain text body
    html: inscriptionMail.html // html body
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      errManager.handleError(res, "Mail can't be send.", err, 500)
    }
  })
}
exports.validateMail = function (mail, token, callback) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      errManager.handleError(null, err.message, 'Failed to connect database.')
    } else {
      var users = db.collection('users')
      var regMail = '^' + mail + '$'
      console.log(mail, '\n', token)
      users.findOneAndReplace({
        'mail': { '$regex': regMail, $options: 'i' },
        'validation.token': token
      },
      { $set: { 'validation.account': true } },
      function (err, ret) {
        if (err) {
          errManager.handleError(null, err, 'Failed to connect database.')
        } else {
          callback(ret.lastErrorObject.updatedExisting)
        }
      })
      db.close()
    }
  })
}
exports.errorMail = function (mail, token) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      errManager.handleError(null, err.message, 'Failed to connect database.')
    } else {
      var users = db.collection('users')
      var regMail = '^' + mail + '$'
      users.findOneAndDelete({
        'mail': {'$regex': regMail, $options: 'i'},
        'validation.token': token,
        'validation.account': false
      })
      db.close()
    }
  })
}
exports.reSendMail = function (mail, callback) {
  MongoClient.connect(conf.db.mongoURI, function (err, db) {
    if (err) {
      errManager.handleError(null, err.message, 'Failed to connect database.')
    } else {
      var users = db.collection('users')
      var regMail = '^' + mail + '$'
      users.findOne({
        'mail': { '$regex': regMail, $options: 'i' }
      }, (err, ret) => {
        if (err) {
          errManager.handleError(null, err.message, 'Failed to connect database.')
        } else {
          callback(ret)
        }
      })
      db.close()
    }
  })
}
