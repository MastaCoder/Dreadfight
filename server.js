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
players = {}; // Type, Location, Rotation, Car Type
scores = [];

// Map Generation
map = [];
for (let i = 0; i < 50; i++) {
    let x = Math.floor(Math.random() * 4001) - 2000,
        y = Math.floor(Math.random() * 4001) - 2000,
        obj = Math.floor(Math.random() * (3 - 0)) + 0;
    map.push([[x, y], obj]);
}

io.on('connection', function(socket) {
    let car_type = Math.floor(Math.random() * (3 - 0)) + 0;
    let location = [Math.floor(Math.random() * 4001) - 2000, Math.floor(Math.random() * 4001) - 2000]
    clients[socket.id] = socket;
    players[socket.id] = [1, location, 0, car_type];
    scores.push([0, socket.id]);
    scores = merge_sort(scores);
    socket.emit("handshake", [players, map, location]);
    socket.emit('leaderboard', scores.slice(0, 5));
    socket.broadcast.emit("catchup", ['connected', socket.id, location, 0, car_type]);
    console.log("[GAME] Player connected:", socket.id);
    socket.on('disconnect', function() {
        console.log("[GAME] Player disconnected:", socket.id);
        delete clients[socket.id];
        delete players[socket.id];
        socket.broadcast.emit("catchup", ['disconnect', socket.id])
    });
    socket.on('update', function(data) { // loc, angle
        players[socket.id][1] = data[0];
        players[socket.id][2] = data[1];
        socket.broadcast.emit("catchup", ['update', socket.id, data[0], data[1]]);
    });
    socket.on('shot', function(data) {
        socket.broadcast.emit('catchup', ['shot', data[0], data[1], data[2], data[3]]); // ['shot', [x, y], angle, owner, speed]
    });
    socket.on("killed", function(data) {
        let find_i = array_lookup(data[1], scores, 1);
        scores[find_i][0]++;
        scores = merge_sort(scores);
        socket.broadcast.emit('leaderboard', scores.slice(0, 5));
    });
});

function merge_sort(arr) {
    if (arr.length == 1)
        return arr;

    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle);

    return merge(
        merge_sort(left),
        merge_sort(right)
    )
}

function merge(left, right) {
    let res = []
    let iLeft = 0
    let iRight = 0

    while (iLeft < left.length && iRight < right.length) {
        if (left[iLeft][0] > right[iRight][0]) {
            res.push(left[iLeft]);
            iLeft++;
        } else {
            res.push(right[iRight]);
            iRight++;
        }
    }

    return res.concat(left.slice(iLeft)).concat(right.slice(iRight))
}

// Taken from https://gist.github.com/narottamdas/26aca662b6eb19322789ec98a445eb18
function array_lookup(searchValue, array, searchIndex) {
  var returnVal = null;
  var i;
  for(i=0; i<array.length; i++) {
    if(array[i][searchIndex]==searchValue)
    {
      returnVal = i;
      break;
    }
  }
  
  return returnVal;
}