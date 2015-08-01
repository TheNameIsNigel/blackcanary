var hangups = require('hangupsjs')
  , utils = require('./utils')
  , E = require('./eval')
  , config = require('../config.json')

module.exports = Hangups

var creds = function() {
    return {
        auth: hangups.authStdin
    }
}

function Hangups() {
    var c = new hangups()
    this.c = c

    var nmsg = false
    c.on('chat_message', function(msg) {
        c.updatewatermark(msg.conversation_id.id, Date.now())

        if(config.verbose == 1) {
            utils.log(msg)
            utils.log('')
        }

        if(config.verbose == 0) {
            utils.log('Conversation ID: %s', msg.conversation_id.id)
            utils.log('Sender ID: %s', msg.sender_id.gaia_id)
            utils.log('Timestamp: %s', msg.timestamp)
        }

        var content = msg.chat_message.message_content.segment
        for (s in content) {
            E.read(content[s], msg.conversation_id.id, msg.sender_id.gaia_id)
        }

        nmsg = true
        c.setactiveclient(true, 100)

        if(config.verbose == 1)
            utils.log('')
    })

    c.on('client_conversation', function(ev) {
        if(!nmsg) {
            if(config.verbose == 0) {
                utils.log('Conversation ID: %s', ev.conversation_id.id)
                utils.log(ev.type, ":", ev.name)
            }
        }

        if(config.verbose == 1) {
            utils.log(ev)
            utils.log('')
        }

        if(config.verbose == 1 || !nmsg) {
            var participants = ev.participant_data
            utils.log('Participants:')
            for (p in participants)
                utils.log(participants[p].fallback_name, ':', participants[p].id.gaia_id)
        }

        nmsg = false
        utils.log('')
    })

    c.on('membership_change', function(ev) {
        if(config.verbose == 0) {
            utils.log('Conversation ID: %s', ev.conversation_id.id)

            if(ev.membership_change.type === 'JOIN') {
                var participants = ev.membership_change.participant_ids
                for (p in participants)
                    utils.log(participants[p].gaia_id, "joined")
            }

            if(ev.membership_change.type === 'LEAVE') {
                var participants = ev.membership_change.participant_ids
                for (p in participants)
                    utils.log(participants[p].gaia_id, "left")
            }
        }

        if(config.verbose == 1) {
            utils.log(ev)
        }

        utils.log('')
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

Hangups.prototype.rename_conversation = function(id, name) {
    this.c.renameconversation(id, name)
}
