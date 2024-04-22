const fs = require('fs')

// read json configfile middleware to election
exports.readSettingsfilemiddleware = (req, res, next) => {
  fs.readFile('./uploads/settings/settings.json', (err, data) => {
    if (data) {
      const doc = JSON.parse(data)
      req.appconfig = doc
      next()
    } else {
      return false
    }
  })
}
// read json configfile middleware to election
exports.readConfigfilemiddleware = (req, res, next) => {
  fs.readFile('./uploads/settings/config.json', (err, data) => {
    if (data) {
      const doc = JSON.parse(data)
      req.default = doc
      next()
    }
  })
}
