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

clients = {}; 
players = {}; // Type, Location, Rotation

io.on('connection', function(socket) {
    clients[socket.id] = socket;
    players[socket.id] = [1, [0, 0], 0];
    socket.emit("handshake", players);
    socket.broadcast.emit("catchup", ['connected', socket.id, [200, 200], 0]);
    console.log("[GAME] Player connected:", socket.id);
    socket.on('disconnect', function() {
        console.log("[GAME] Player disconnected:", socket.id);
        delete clients[socket.id];
        delete players[socket.id];
        socket.broadcast.emit("catchup", ['disconnect', socket.id])
    });
    socket.on('update', function(data) { // loc, angle
        players[socket.id] = [1, data[0], data[1]];
        socket.broadcast.emit("catchup", ['update', socket.id, data[0], data[1]]);
    });
});