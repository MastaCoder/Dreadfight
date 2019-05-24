var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

socket.emit('data', ['gary is really straight', 2387128736]);

var x = 0;

function setup() {
    createCanvas(500, 500);
    fill(5, 5, 5);
}

function draw() {
    x += 1
    rect(0 + x, 0, 100, 100);
}