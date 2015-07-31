var hangups = require('hangupsjs')
  , utils = require('./utils')

module.exports = Hangups

function Hangups() {
    var creds = function() {
        return {
            auth: hangups.authStdin
        }
    }

    var c = new hangups()
    this.c = c

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
}

Hangups.prototype.connect = function() {
    this.c.connect(this.creds)
}

// Send a pre-formatted message to a converation id.
Hangups.prototype.send_formatted_msg = function(id, fmsg) {
    this.c.sendchatmessage(id, fmsg)
}

// Send an unformatted message to a conversation id.
Hangups.prototype.send_simple_msg = function(id, ufmsg) {
    utils.log("send_simple_msg: %s", ufmsg)

    var bld = new hangups.MessageBuilder()
      , segments = bld.text(ufmsg).toSegments()

    this.c.send_formatted_msg(id, segments)
}

Hangups.prototype.send_easter_egg = function(id, egg) {
    this.c.sendeasteregg(id, egg)
}
