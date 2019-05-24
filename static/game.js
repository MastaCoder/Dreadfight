var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

socket.emit('data', ['gary is really straight', 2387128736]);

var x = 0;

function setup() {
    createCanvas(640, 480);
  }
  
  function draw() {
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
  }