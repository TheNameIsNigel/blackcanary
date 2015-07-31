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
        if(content.text === '!' && sender === '104316984199094368159') {
            utils.H.send_easter_egg(conversation, 'ponies')
        }
    }
}
