var utils = require('./lib/utils')
  , express = require('express')
  , app = express()

app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.render('index'
               , { title: 'BlackCanary Admin Portal', message: 'Hello there!'}
    )
})

var server = app.listen(3000, function() {
    var host = server.address().address
      , port = server.address().port

    if(host === '::')
        host = 'localhost'
    utils.log('Admin portal may be accessed at http://%s:%s', host, port)
})
