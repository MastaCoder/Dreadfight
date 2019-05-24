// Dependancies and initialization
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

// Configuration
app.set('port', 5000); // Port #
app.use('/', express.static(__dirname + '/static')); // static loc
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html')); // send index
});

// Initialization
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

io.on('connection', function(socket) {
    console.log("user has connected");
    socket.on('data', function(msg) {
        console.log(msg)
    });
});