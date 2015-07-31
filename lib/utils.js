var util = require('util')

exports.log = function() {
    console.log(util.format.apply(this, arguments))
}

exports.error = function() {
    util.log(util.format.apply(this, arguments))
}
