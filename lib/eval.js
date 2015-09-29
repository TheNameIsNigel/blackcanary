var utils = require('./utils')
  , MessageBuilder = require('hangupsjs').MessageBuilder
  , config = require('../config.json')

var admins = config.admins

/*
 * Just keep some conversation IDs here for convenience until the DB is setup.
 *
 * Canary's Nest: Ugx0rdvE3sVeYN5Uzg94AaABAQ
 * Nathan: UgyshQIDsg8ecHC7RxJ4AaABAQ
 * Ryan: UgzJCpCIG3Ls2LKpJx54AaABAQ
 * Patrick: Ugxis3xP2yHxj5XA76h4AaABAQ
 * Drew: UgyHqXm4W3DMyZN4EQt4AaABAQ
 *
 * Let's store some gaia id's as well.
 *
 * Ryan Norris : 104695050261726198587
 * Patrick Campanale : 112082828842151104248
 * Nathan Bass : 104316984199094368159
 * Jon DeVere : 100014455006844678883
 * Black Canary : 106641720246698104101
 * Michael Ballard : 118144092368449671096
 * Brett Reiser (Beezy) : 112710511108250498954
 * Drew Walton : 109643193860817626489
 *
 */

var btypes = [
    { egg : 'bikeshed', times : 30 },
    { egg : 'pitchforks', times : 7 },
    { egg : 'ponies', times : 100 }
]

var command_flag = config.command_flag ? config.command_flag : '!'

dostab = function(conversation) {
    var msgs = [
        'Stab it! Stab it nao!!!',
        'Stab it in the ass, it will run faster!',
        'Stab it! With a rusted spork!'
    ]

    var n = Math.floor(Math.random() * 3)
      , bld = new MessageBuilder()
      , segments = bld.bold(msgs[n]).toSegments()
    utils.H.send_formatted_msg(conversation, segments)
}

spambomb = function(conversation, btype) {
    for(var i = 0; i < btypes[btype].times; i++)
        utils.H.send_easter_egg(conversation, btypes[btype].egg)
}

/* Read a message segment maybe and act on it based on content, conversation
 * and sender. */
exports.read = function(content, conversation, sender) {
    utils.log(content.type, ':', content.text)
    if(content.formatting !== null)
        utils.log(content.formatting)
    if(content.link_data !== null)
        utils.log(content.link_data)

    /* To enable admin only access to a command add below as an if.
     * admins.indexOf(sender) > -1
     */
    if(content.type === 'TEXT' && content.text.length > 0) {
        var lower_str = content.text.toLowerCase()
        if(content.text.charAt(0) === command_flag) {
            /* Remove the exclamation point (command indicator) and split the
             * the command_str into an array. */
            var command_str = lower_str.slice(1)
              , command_arr = command_str.split(' ')

            // Evaluate single argument commands first (Keep in alpha!).
            if(command_arr.length === 1) {
                if(command_arr[0] === 'bikeshed')
                    utils.H.send_easter_egg(conversation, 'bikeshed')

                if(command_arr[0] === 'bomb') {
                    var n = Math.floor(Math.random() * 3)
                    spambomb(conversation, n)
                }

            	if(command_arr[0] === 'bp')
                    utils.H.send_simple_msg(conversation, 'Bye Patrick.')

                if(command_arr[0] === 'pitchforks')
                        utils.H.send_easter_egg(conversation, 'pitchforks')

                if(command_arr[0] === 'pitchforkmob') {
                    var bld = new MessageBuilder()
                      , segments = bld.bold('Run for your lives!!!').toSegments()
                    utils.H.send_formatted_msg(conversation, segments)
                    spambomb(conversation, 1)
                }

                if(command_arr[0] === 'ponies')
                    utils.H.send_easter_egg(conversation, 'ponies')

                if(command_arr[0] === 'ponybomb') {
                    var bld = new MessageBuilder()
                      , segments = bld.bold('PONIES!!!').toSegments()
                    utils.H.send_formatted_msg(conversation, segments)
                    spambomb(conversation, 2)
                }

                // This command will tell Jenkins to build COT. TODO: Let us specify the device.
                if(command_arr[0] === 'buildcot') {
                    var args = {
                        data : {
                            device : 'shamu',
							BuildType : 'recoveryimage'
                        },
                        headers : { 'Content-Type': 'application/json', 'token': 'b21f0214d30897c3b21c988e97a91af3' }
                    }

                    utils.R.post('https://pocbuild.basketbuild.com/job/CM_COT3/build', args, function(data, response) {
                        utils.log(data)
                        utils.log(response)
                    })
                }

                if(command_arr[0] === 'shedbomb') {
                    utils.H.send_simple_msg(conversation, 'Bicycle! Bicycle!! I want to ride my bicycle; I want to ride my bike!!!')
                    spambomb(conversation, 0)
                }

                if(command_arr[0] === 'stab')
                    dostab(conversation)
            }

            // Handle multi-argument commands second (Keep in alpha!).
            if(command_arr.length > 1) {
                /* Create a new group or solo conversation. Solo can create a
                 * group if multiple IDs are passed to it otherwise group will
                 * always create a group regardless of the number of IDs passed.
                 */
                if(command_arr[0] === 'create') {
                    /* Since split is being stupid about the second array arg
                     * we're going to handle this like we did message. */
                    var create_str = command_str.slice(6).trim()
                      , create_arr = command_str.split(' ')
                    /* For some insanely stupid reason split doesn't work to
                     * break a string of IDs apart so creating the array of
                     * IDs for a new group is failing.... *
                    if(create_str.search('group') === 0) {
                        utils.log('create group called')
                        var id_str = command_str.slice(create_arr[0].length + 6).trim()
                          , id_arr = id_str.split(' ')
                        utils.log(id_arr)
                        /*
                        var newid = utils.H.new_group(id_arr)
                        newid.then(function(res) {
                            utils.log(newid)
                            //utils.H.send_simple_msg(res.conversation.id.id, 'Hi everybody!')
                        })
                        *
                    }
                    */
                    // Create a new solo conversation from a given ID.
                    if(create_str.search('solo') === 0) {
                        var id_str = create_str.slice(create_arr[0].length - 1).trim()
                          , id_arr = id_str.split(' ')
                          , newid = utils.H.new_solo(id_arr)
                        newid.then(function(res) {
                            utils.H.send_simple_msg(res.conversation.id.id, 'Heyas!')
                        })
                    }
                }

                if(command_arr[0] === 'echo')
                    utils.H.send_simple_msg(conversation, command_str.slice(command_arr[0].length).trim())

                /* For whatever reason split doesn't work when trying to split
                 * the conversation_id from the 'msg' command itself so instead
                 * search for 'msg' and if it matches at index 0 slice msg off
                 * the front of the string and split it from there. */
                if(command_str.search('msg') === 0) {
                    var msg_str = command_str.slice(3).trim()
                      , msg_arr = msg_str.split(' ')

                    utils.H.send_simple_msg(msg_arr[0], msg_str.slice(msg_arr[0].length))
                }

                // Rename a group hangout.
                if(command_arr[0] === 'rename')
                    utils.H.rename_conversation(conversation, command_str.slice(command_arr[0].length))
            }
        } else if (sender !== '106641720246698104101'){
            // Evaluate non-commands
            if(lower_str.search('stab') > -1)
                dostab(conversation)
        }
    }
}
