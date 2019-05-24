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
    /*
    if (mouseIsPressed){
        rect(mouseX, mouseY, 10, 10);
    }
    */
   //skin "Makan"
    noStroke();
    fill(0);
    rect(3, 0, 50, 100);
    fill(255, 0, 0);
    rect(23, 87.5, 10, 5);
    fill(232, 171, 127);
    rect(3, 20, 50, 60);
    strokeWeight(3);
    stroke(0);
    rect(8, 45, 16, 8);
    rect(32, 45, 16, 8);

    //wheels
    rect(0, 10, 3, 20)
    rect(0, 60, 3, 20)
    rect(53, 10, 3, 20)
    rect(53, 60, 3, 20)


}