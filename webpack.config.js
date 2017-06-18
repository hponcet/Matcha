const path = require('path')

module.exports = {
  entry: {
    'app': './matcha/public/app.js'
  },
  output: {
    path: path.join(__dirname, '/matcha/public'),
    filename: './dist/app.bundle.js'
  },
  watchOptions: {
    poll: true
  }
}
