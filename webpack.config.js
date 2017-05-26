const path = require('path')

module.exports = {
  entry: {
    app: './matcha/public/app.js'
  },
  output: {
    filename: './matcha/public/app.bundle.js'
  },
  watchOptions: {
    poll: true
  },
}
