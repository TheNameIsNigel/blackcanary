var hangups = require('hangupsjs')
  , utils = require('./utils')

var creds = function() {
    return {
        auth: hangups.authStdin
    }
}

var c = new hangups()

c.on('connect', function() {
    utils.log('connected')
})

c.on('chat_message', function(ev) {
    utils.log(ev)
})

exports.connect = function() {
    c.connect(creds)
}
