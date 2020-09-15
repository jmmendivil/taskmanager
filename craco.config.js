var path = require('path')
module.exports = {
  webpack: {
    alias: {
      Utils: path.resolve(__dirname, 'src/utils/'),
      Constants: path.resolve(__dirname, 'src/constants/')
    }
  }
}
