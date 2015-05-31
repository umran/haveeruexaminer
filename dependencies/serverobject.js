// load dependencies
var app = require('../app');
var http = require('http');

// define http and socket.io port
var port = '3000';
app.set('port', port);

// http and socket.io setup 
var server = http.createServer(app);
var io = require('socket.io')(server);

// start http and socket.io server
server.listen(port);

// isolate mongod connection and prepare for export
mongod = app.mongod;

// export variables
module.exports.httpd = server;
module.exports.mongod = mongod;
module.exports.io = io;