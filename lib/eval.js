var utils = require('./utils')

/* Read a message segment maybe and act on it based on content, conversation
 * and sender. */
exports.read = function(content, conversation, sender) {
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
            var command_str = content.text.slice(1)
              , command_arr = command_str.split(' ')
            // Evaluate single argument commands first (Keep in alpha!).
            if(command_arr.length === 1) {
                if(command_arr[0] === 'ponies')
                    utils.H.send_easter_egg(conversation, 'ponies')
            }

            if(command_arr.length > 1) {
                if(command_arr[0] === 'echo')
                    utils.H.send_simple_msg(conversation, command_str.slice(command_arr[0].length))

                /* Partly working msg function, Almost?
                if(command_str.search('msg') === 0) {
                    var msg_str = command_str.slice(3)
                      , msg_arr = msg_str.split(' ')

                    utils.log(msg_arr[0])
                    utils.H.send_simple_msg(msg_arr[0], msg_arr[1])
                }
                */
            }
        }
    }
}
