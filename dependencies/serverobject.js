// load dependencies
var app = require('../app');
var http = require('http');

// define http and socket.io port
var address = 'localhost';
var port = '3080';
app.set('port', port);

// http and socket.io setup 
var server = http.createServer(app);
var io = require('socket.io')(server, {
  cookie: false
});

// start http and socket.io server
server.listen(port, address);

//pass io object to io module
require('./io')(io);

// isolate mongod connection and prepare for export
var mongod = app.mongod;

// export variables
module.exports.httpd = server;
module.exports.mongod = mongod;