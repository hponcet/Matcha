/* Info params */
const fname = 'Poncet'
const sname = 'Hugues'
const email = 'hponcet@student.42.fr'
const cr = '© 2016/2017'
const orga = '42school'

/* DB params */
const DB_ADDRESS = 'localhost'
const DB_PORT = '27017'
const DB_NAME = 'matcha'

/* Server params */
const HOST_ADDRESS = 'localhost'
const SERVER_PORT = process.env.PORT || 3000

module.exports =
{
  info: {
    fn: fname,
    sn: sname,
    email: email,
    cr: cr,
    orga: orga
  },
  server: {
    serverPort: SERVER_PORT,
    hostAddr: HOST_ADDRESS + ':' + SERVER_PORT + '/',
    SESSION_TIME: 3600 * 24 * 7,
    FREQ_SESSION_CONTROL: 3600 * 24 * 1000
  },
  db: {
    mongoURI: 'mongodb://' + DB_ADDRESS + ':' + DB_PORT + '/' + DB_NAME,
    PSW_SALT: '3eV-d!nP7LP@H5Dx',
    GOOGLE_GEOLOCATION_API_KEY: 'AIzaSyBcD1MhNdSpeCvyaKtJorFRcs8-t4sHgsQ'
  }
}
