var Hangups = require('hangupsjs')
  , utils = require('./utils')
  , creds = function() {
    return {
        auth: c.authStdin
    }
}

var c = new Hangups()

c.on('chat_message', function(ev) {
    utils.log(ev)
})

c.connect(creds).then(function() {
    c.sendchatmessage('UgzJilj2Tg_oqkAaABAQ'), [[0, 'Hello World']]
}).done()
