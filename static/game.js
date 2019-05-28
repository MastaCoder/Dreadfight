var socket = io();

// socket.on('stuff', function(data) {
//     console.log(data);
//     rect(data[0], data[1], 25, 25);
// });

/* VARIABLES */
var controls = {
    'w': false,
    'a': false,
    's': false,
    'd': false
};

var player,
    scene = [];

class Car {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 0;
        this.car = new Car(this.x, this.y);
    }

    move(up, right) {
        this.y -= up;
        this.x += right;
    }

    player_render() {
        // render 350, 325
    }

    render(off_x, off_y) {
        // movement
    }
}

class Tree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render(off_x, off_y) {
        fill(0);
        rect(this.x + 375 - off_x, this.y + 350 - off_y, 50, 50);
    }
}

/* FUNCTIONS */
function setup() {
    createCanvas(750, 700);
    rectMode(CENTER);
    player = new Player(0, 0);
    scene.push(new Tree(10, 10))
}

function render() {
    for (let i = 0; i < scene.length; i++) {
        scene[i].render(player.x, player.y);
    }

    player.render();
}

function keyControl() {
    if (controls['w']) {
        player.move(5, 0);
    } else if (controls['s']) {
        player.move(-5, 0);
    }

    if (controls['a']) {
        player.move(0, -5);
    } else if (controls['d']) {
        player.move(0, 5);
    }
}

function keyPressed() {
    if (key in controls)
        controls[key] = true;

    return false;
}

function keyReleased() {
    if (key in controls)
        controls[key] = false;

    return false;
}

function draw() {
    background(255);
    keyControl();
    render();
}