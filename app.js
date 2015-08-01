var utils = require('./lib/utils');

var express = require('express');
var http = require('http');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function (req, res) {
    res.render('index'
        , {title: 'BlackCanary Admin Portal', message: 'Hello there!'}
    )
})

var server = app.listen(3000, function () {
    var host = server.address().address
        , port = server.address().port

    if (host === '::')
        host = 'localhost'
    utils.log('Admin portal may be accessed at http://%s:%s', host, port)
})
