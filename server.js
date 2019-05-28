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

console.log("[INFO] DreadFight - A driving top-down shooter.")
console.log("[INFO] Backend developed by Makan, Gary, & Anthony");

// Initialization
server.listen(5000, function() {
    console.log("[GAME] Server is listening on port 5000.")
});

console.log("---------------------------------------------")

// ---------------- GAME CODE -----------------------

players = []

io.on('connection', function(socket) {
    players.push(socket);
    console.log("[GAME] Player connected.");
    socket.on('message', function(msg) {
        
    });
});