// Dependancies and initialization
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var figlet = require('figlet');
var mathjs = require('mathjs');

// Configuration
app.set('port', 5000); // Port #
app.use('/', express.static(__dirname + '/static')); // static loc
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html')); // send index
});

figlet('Dreadfight', function(err, data) {
    console.log(data);
    console.log("[INFO] Backend developed by Makan, Gary, & Anthony");
    console.log("---------------------------------------------");
});

// Initialization
server.listen(5000, function() {
    console.log("[GAME] Server is listening on port 5000.");
});

// ---------------- GAME CODE -----------------------

// Base array stuff
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

/**
 * Function that is run when the socket connects
*/
io.on('connection', function(socket) {
    // Welcome handshake
    let car_type = Math.floor(Math.random() * (3 - 0)) + 0; // Car type
    let location;

    while (1) { // Safe spawn
        location = [Math.floor(Math.random() * 3801) - 1900, Math.floor(Math.random() * 3801) - 1900]; // Random location
        found = false; // Not found by default.
        for (let i in map) {
            if (mathjs.distance([map[i][0][0], map[i][0][1]], [location[0], location[1]]) < 75) { // Check all map objects
                found = true;
            }
        }
        if (!found) break; // Found a spot
    }

    clients[socket.id] = socket; // Add to clients
    players[socket.id] = [1, location, 0, car_type]; // Add to players
    scores.push([0, socket.id]); // Add to scores
    scores = merge_sort(scores); // Sort scores
    socket.emit("handshake", [players, map, location]); // Send back the handshake data
    socket.emit('leaderboard', scores.slice(0, 5)); // Send back leaderboard
    socket.emit("news", "Welcome to Dreadfight!");

    // Emit ot all about the connection
    socket.broadcast.emit("catchup", ['connected', socket.id, location, 0, car_type]);
    console.log("[GAME] Player connected:", socket.id);

    /**
     * Function when the socket disconnects
    */
    socket.on('disconnect', function() {
        console.log("[GAME] Player disconnected:", socket.id);
        delete clients[socket.id]; // Remove the client
        delete players[socket.id]; // Remove the player
        socket.broadcast.emit("catchup", ['disconnect', socket.id]); // Emit to others
    });

    /**
     * Function when the socket updates a location
    */
    socket.on('update', function(data) { // loc, angle
        players[socket.id][1] = data[0]; // Get the x
        players[socket.id][2] = data[1]; // Get the y
        socket.broadcast.emit("catchup", ['update', socket.id, data[0], data[1]]); // Emit new player data
    });

    /**
     * Player has shot a bullet on socket.
    */
    socket.on('shot', function(data) {
        socket.broadcast.emit('catchup', ['shot', data[0], data[1], data[2], data[3]]); // ['shot', [x, y], angle, owner, speed]
    });

    /**
     * Score is increased for a player.
    */
    socket.on("score", function(data) {
        try {
            let find_i = array_lookup(data[0], scores, 1); // Find user in the scores
            scores[find_i][0] += data[1]; // Increase
            scores = merge_sort(scores); // Sort the scores
            socket.broadcast.emit('leaderboard', scores.slice(0, 5)); // Send to all
            socket.emit("leaderboard", scores.slice(0, 5)) // Send back to player
        } catch (err) {
            console.log("[WARN] Score storing exception occurred.")
        }
    });

    /**
     * Score is increased for a player.
    */
    socket.on("news", function(data) {
        socket.emit("news", data);
        socket.broadcast.emit("news", data);
        console.log("[GAME] News was sent out!");
    });
});

/**
 * Custom function to render on the screen.
 * @param {array} arr - base array to merge
*/
function merge_sort(arr) {
    if (arr.length == 1)
        return arr; // Don't split 1 length

    let middle = Math.floor(arr.length / 2); // middle of array
    let left = arr.slice(0, middle); // Left side
    let right = arr.slice(middle); // Right side

    // Run merge sort on both sides.
    return merge(
        merge_sort(left),
        merge_sort(right)
    );
}

/**
 * Minor merge sort function
 * @param {array} left - left side of the array
 * @param {array} right - right side of the array
*/
function merge(left, right) {
    let res = []; // Result
    let iLeft = 0; // Left index
    let iRight = 0; // Right index

    while (iLeft < left.length && iRight < right.length) { // Loop to the end
        if (left[iLeft][0] > right[iRight][0]) { // Sort
            res.push(left[iLeft]);
            iLeft++;
        } else {
            res.push(right[iRight]);
            iRight++;
        }
    }

    // Combine the list with concat
    return res.concat(left.slice(iLeft)).concat(right.slice(iRight))
}

// Taken from https://gist.github.com/narottamdas/26aca662b6eb19322789ec98a445eb18
function array_lookup(searchValue, array, searchIndex) {
    var returnVal = null;
    for (let i = 0; i < array.length; i++) {
        if (array[i][searchIndex] == searchValue) {
            returnVal = i; 
            break;
        }
    }

    return returnVal;
}