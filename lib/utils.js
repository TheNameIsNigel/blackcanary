var util = require('util')
var Hangups = require('./hangups')

exports.H = new Hangups()

exports.log = function() {
    console.log(util.format.apply(this, arguments))
}

exports.error = function() {
    util.log(util.format.apply(this, arguments))
}
