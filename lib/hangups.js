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

// Send an unformatted message to a conversation id.
exports.send_simple_msg = function(id, ufmsg) {
    var bld = new hangups.MessageBuilder()
      , segments = bld.text(ufmsg).toSegments()

    c.sendchatmessage(id, segments)
}
