//-- Info config --//
const fname = 'Poncet';
const sname = 'Hugues';
const email = 'hponcet@student.42.fr';
const cr    = '© 2016/2017';
const orga  = '42school';


module.exports = {
    info: {
        fn:     fname,
        sn:     sname,
        email:  email,
        cr:     cr,
        orga:   orga
    },
    //-- Site config --//
    server: {
        serverPort:     process.env.PORT || 3000,
        socketPort:     '',
        hostAddr:       '127.0.0.1:3000/',
        siteTitle:      'Matcha',
        rootPath:       __dirname,
        viewsLocation:  __dirname + '/views',
        SESSION_TIME:   604800
    },
    //-- Database config --//
    db: {
        mongoURL:       'mongodb://localhost:27017/matcha',
        mongoUsers:     'users'
    }
};
