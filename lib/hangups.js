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
      , p = c.messageParser
    this.c = c

    c.on('connected', function() {
        // Umm We could do something here :P
    })

    c.on('chat_message', function(msg) {
        utils.log("Conversation ID: %s", msg.conversation_id.id)
        utils.log("Sender ID: %s", msg.sender_id.gaia_id)
        utils.log("Timestamp: %s", msg.timestamp)
        utils.log(msg.chat_message.message_content.segment)
    })

    c.on('client_conversation', function(ev) {
        utils.log(ev.type, ev.name, "\n")
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
