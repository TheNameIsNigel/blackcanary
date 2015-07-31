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
        && sender === '104316984199094368159') {
            var command = content.text.slice(1)
            if(command === 'ponies')
                utils.H.send_easter_egg(conversation, 'ponies')
        }
    }
}
