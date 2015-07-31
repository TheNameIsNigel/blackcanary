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

c.on('client_conversation', function(ev) {
    utils.log(ev)
})

c.on('membership_change', function(ev) {
    utils.log(ev)
})

exports.connect = function() {
    c.connect(creds)
}

// Send a pre-formatted message to a converation id.
exports.send_formatted_msg = function(id, fmsg) {
    c.sendchatmessage(id, fmsg)
}

// Send an unformatted message to a conversation id.
exports.send_simple_msg = function(id, ufmsg) {
    utils.log("send_simple_msg: %s", ufmsg)

    var bld = new hangups.MessageBuilder()
      , segments = bld.text(ufmsg).toSegments()

    //c.sendchatmessage(id, segments)
    this.send_formatted_msg(id, segments)
}

exports.send_easter_egg = function(id, egg) {
    c.sendeasteregg(id, egg)
}
