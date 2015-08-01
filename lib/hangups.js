var hangups = require('hangupsjs')
  , utils = require('./utils')
  , E = require('./eval')

module.exports = Hangups

var creds = function() {
    return {
        auth: hangups.authStdin
    }
}

function Hangups() {
    var c = new hangups()
    this.c = c

    c.on('chat_message', function(msg) {
        utils.log('Conversation ID: %s', msg.conversation_id.id)
        utils.log('Sender ID: %s', msg.sender_id.gaia_id)
        utils.log('Timestamp: %s', msg.timestamp)

        var content = msg.chat_message.message_content.segment
        for (s in content) {
            E.read(content[s], msg.conversation_id.id, msg.sender_id.gaia_id)
        }
    })

    c.on('client_conversation', function(ev) {
        utils.log(ev.type, ":", ev.name, "\n")
    })

    c.on('membership_change', function(ev) {
        utils.log(ev)
    })
}

Hangups.prototype.connect = function() {
    this.c.connect(creds)
}

// Send a pre-formatted message to a converation id.
Hangups.prototype.send_formatted_msg = function(id, fmsg) {
    this.c.sendchatmessage(id, fmsg)
}

// Send an unformatted message to a conversation id.
Hangups.prototype.send_simple_msg = function(id, ufmsg) {
    utils.log('send_simple_msg: %s, %s', id, ufmsg)

    var bld = new hangups.MessageBuilder()
      , segments = bld.text(ufmsg).toSegments()

    this.send_formatted_msg(id, segments)
}

Hangups.prototype.send_easter_egg = function(id, egg) {
    this.c.sendeasteregg(id, egg)
}

// Update the read watermark.
Hangups.prototype.update_watermark = function(id) {
    this.c.updatewatermark(id, Date.now())
}

// Rename a group conversation.
Hangups.prototype.rename_conversation = function(id, name) {
    this.c.renameconversation(id, name)
}

// Create a new conversation inviting any provided chat IDs
Hangups.prototype.create_conversation = function(ids, group) {
    this.c.createconversation(ids, group)
}

// Create a new group conversation
Hangups.prototype.new_group = function(ids) {
    this.create_conversation(ids, true)
}

// Create solo converation
Hangups.prototype.new_solo = function(id) {
    utils.log('create_conversation', id)
    this.create_conversation(id, false)
}
