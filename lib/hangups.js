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
      , selfID
    this.c = c
    this.selfID = selfID

    var nmsg = false
    c.on('chat_message', function(msg) {
        c.updatewatermark(msg.conversation_id.id, Date.now())
        c.setfocus(msg.conversation_id.id)

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
            if(config.verbose == 1)
                utils.log('Participants:')

            for (p in participants)
                utils.log(participants[p].fallback_name, ':', participants[p].id.gaia_id)
        }

        nmsg = false
        utils.log('')
    })

    c.on('membership_change', function(ev) {
        if(config.verbose == 0) {
            var participants
            utils.log('Conversation ID: %s', ev.conversation_id.id)

            if(ev.membership_change.type === 'JOIN') {
                participants = ev.membership_change.participant_ids
                for (p in participants)
                    utils.log(participants[p].gaia_id, "joined")
            }

            if(ev.membership_change.type === 'LEAVE') {
                participants = ev.membership_change.participant_ids
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
    var self = this
    this.c.connect(creds)
    this.c.setpresence(true)
    this.c.setactiveclient(true, 100)
    var info = this.c.getselfinfo()
    info.then(function(res) {
        self.selfID = res.self_entity.id.gaia_id
        if(config.verbose == 0) {
            utils.log('Reachable:', res.self_entity.presence.reachable)
            utils.log('Available:', res.self_entity.presence.available)
            utils.log('ID:', self.selfID)
            utils.log(res.self_entity.properties.display_name, ':', res.self_entity.properties.email[0])
        }
        if(config.verbose == 1)
            utils.log(res)

        utils.log('')
    })
}

// Send a pre-formatted message to a converation id.
Hangups.prototype.send_formatted_msg = function(id, fmsg) {
    utils.log('send messge:', id, fmsg)
    this.c.sendchatmessage(id, fmsg)
}

// Send an unformatted message to a conversation id.
Hangups.prototype.send_simple_msg = function(id, ufmsg) {
    var bld = new hangups.MessageBuilder()
      , segments = bld.text(ufmsg).toSegments()

    this.send_formatted_msg(id, segments)
}

Hangups.prototype.send_easter_egg = function(id, egg) {
    this.c.sendeasteregg(id, egg)
}

// Rename a group conversation.
Hangups.prototype.rename_conversation = function(id, name) {
    this.c.renameconversation(id, name)
}

// Create a new conversation inviting any provided chat IDs
Hangups.prototype.create_conversation = function(ids, group) {
    return this.c.createconversation(ids, group)
}

// Create a new group conversation
Hangups.prototype.new_group = function(ids) {
    utils.log('create_conversation', ids)
    return this.create_conversation(ids, true)
}

// Create solo converation
Hangups.prototype.new_solo = function(id) {
    return this.create_conversation(id, false)
}
