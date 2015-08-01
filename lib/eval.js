var utils = require('./utils')
var MessageBuilder = require('hangupsjs').MessageBuilder

/* Read a message segment maybe and act on it based on content, conversation
 * and sender. */
exports.read = function(content, conversation, sender) {
    utils.H.update_watermark(conversation)

    utils.log(content.type, ":", content.text)
    if(content.formatting !== null)
        utils.log(content.formatting)
    if(content.link_data !== null)
        utils.log(content.link_data)

    if(content.type === 'TEXT') {
        if(content.text.charAt(0) === '!'
        && content.text.length > 0
        && (sender === '104316984199094368159' // Nathan
        || sender === '109643193860817626489' // Drew
        || sender === '104695050261726198587' // Ryan
        || sender === '112082828842151104248' /* Patrick */)) {
            /* Remove the exclamation point (command indicator) and split the
             * the command_str into an array. */
            var command_str = content.text.slice(1)
              , command_arr = command_str.split(' ')

            // Evaluate single argument commands first (Keep in alpha!).
            if(command_arr.length === 1) {
                if(command_arr[0] === 'bikeshed')
                    utils.H.send_easter_egg(conversation, 'bikeshed')

                if(command_arr[0] === 'pitchforks')
                        utils.H.send_easter_egg(conversation, 'pitchforks')

                if(command_arr[0] === 'ponies')
                    utils.H.send_easter_egg(conversation, 'ponies')

                if(command_arr[0] === 'ponybomb') {
                    var bld = new MessageBuilder()
                      , segments = bld.bold('PONIES!!!').toSegments()
                    utils.H.send_formatted_msg(conversation, segments)
                    for(var i = 0; i < 100; i++)
                        utils.H.send_easter_egg(conversation, 'ponies')
                }
            }

            // Handle multi-argument commands second (Keep in alpha!).
            if(command_arr.length > 1) {
                if(command_arr[0] === 'echo')
                    utils.H.send_simple_msg(conversation, command_str.slice(command_arr[0].length).trim())

                /* For whatever reason split doesn't work when trying to split
                 * the conversation_id from the 'msg' command itself so instead
                 * search for 'msg' and if it matches at index 0 slice msg off
                 * the front of the string and split it from there. */
                if(command_str.search('msg') === 0) {
                    var msg_str = command_str.slice(3)
                      , msg_arr = msg_str.split(' ')

                    utils.H.send_simple_msg(msg_arr[0].trim(), msg_str.slice(msg_arr[0].length))
                }

                // Rename a group hangout.
                if(command_arr[0] === 'rename')
                    utils.H.rename_conversation(conversation, command_str.slice(command_arr[0].length))
            }
        }
    }
}
