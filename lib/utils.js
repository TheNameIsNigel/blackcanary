var util = require('util')
  , Rest = require('node-rest-client').Client
  , Hangups = require('./hangups')

exports.H = new Hangups()
exports.R = new Rest()

exports.log = function() {
    console.log(util.format.apply(this, arguments))
}

exports.error = function() {
    util.log(util.format.apply(this, arguments))
}
