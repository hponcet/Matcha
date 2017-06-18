//-- Info params --//
const fname = 'Poncet'
const sname = 'Hugues'
const email = 'hponcet@student.42.fr'
const cr    = '© 2016/2017'
const orga  = '42school'

//-- DB params --//
const DB_PORT = 27117
const DB_NAME = 'matcha'

//-- Server params --//
const HOST_ADDRESS = 'localhost'


module.exports = {
    info: {
        fn:     fname,
        sn:     sname,
        email:  email,
        cr:     cr,
        orga:   orga
    },
    server: {
        serverPort:     process.env.PORT || 3000,
        socketPort:     '',
        hostAddr:       HOST_ADDRESS + ':3000/',
        siteTitle:      'Matcha',
        rootPath:       __dirname,
        viewsLocation:  __dirname + '/views',
        SESSION_TIME:   604800
    },
    db: {
        mongoURL:       'mongodb://' + HOST_ADDRESS + ':' + DB_PORT + '/' + DB_NAME,
        mongoUsers:     'users'
    }
};
