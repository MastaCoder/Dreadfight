var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

socket.emit('data', 1);

var x = 0;
var y = 0;

function setup() {
    createCanvas(window.innerWidth - 20, window.innerHeight - 20);
    fill(5, 5, 5);
}

function draw() {
    rect(0 + x, 0 + y, 100, 100);
}