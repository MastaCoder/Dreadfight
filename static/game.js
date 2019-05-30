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
    players = {},
    scene = [],
    connected = false;

class Car {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.velocity = [0, 0]; // x, y
        this.type = 0;
        this.id = id;
    }

    move(up) {
        this.y -= up;
    }

    player_render() {
        push();
        translate(375, 350);
        rotate(radians(this.angle));
        this.draw();
        pop();
    }

    render(off_x, off_y) {
        push();
        translate(this.x + 375 - off_x, this.y + 350 - off_y);
        rotate(radians(this.angle));
        this.draw();
        pop();
    }

    draw() {
        noStroke();
        fill(0);
        rect(0, 0, 50, 100);

        fill(255, 0, 0);
        rect(0, 37.5, 10, 5);

        fill(232, 171, 127);
        rect(0, 0, 50, 60);

        strokeWeight(3);
        stroke(0);
        rect(-12, 0, 16, 8);
        rect(12, 0, 16, 8);

        noStroke();
        fill(0)
        rect(-26.5, -20, 3, 20)
        rect(-26.5, 30, 3, 20)
        rect(26.5, -20, 3, 20)
        rect(26.5, 30, 3, 20)
    }

    rotate(angle) {
        this.angle += angle;
    }

    move_velocity() {
        let angle, friction;

        if (this.velocity[0] != 0 && this.velocity[1] != 0) {
            angle = degrees(Math.atan(Math.abs(this.velocity[0]) / Math.abs(this.velocity[1]))); // get the angle of the velocity
        } else {
            angle = 0; // treat as 0
        }

        friction = 1.75; // friction vector

        // TR 1
        if (this.velocity[0] > 0 && this.velocity[1] > 0) {
            this.velocity[0] -= Math.sin(radians(angle)) * friction;
            this.velocity[1] -= Math.cos(radians(angle)) * friction;
            if (this.velocity[0] < 0 || this.velocity[1] < 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
        // BR 2
        } else if (this.velocity[0] > 0 && this.velocity[1] < 0) {
            this.velocity[0] -= Math.sin(radians(angle)) * friction;
            this.velocity[1] += Math.cos(radians(angle)) * friction;
            if (this.velocity[0] < 0 || this.velocity[1] > 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
        // BL 3
        } else if (this.velocity[0] < 0 && this.velocity[1] < 0) {
            this.velocity[0] += Math.sin(radians(angle)) * friction;
            this.velocity[1] += Math.cos(radians(angle)) * friction;
            if (this.velocity[0] > 0 || this.velocity[1] > 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
        // TL 4
        } else if (this.velocity[0] < 0 && this.velocity[1] > 0) {
            this.velocity[0] += Math.sin(radians(angle)) * friction;
            this.velocity[1] -= Math.cos(radians(angle)) * friction;
            if (this.velocity[0] > 0 || this.velocity[1] < 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
        // Y Only?
        } else if (this.velocity[0] == 0 && this.velocity[1] != 0) {
            if (this.velocity[1] > 0) {
                this.velocity[1] -= 1;
            } else {
                this.velocity[1] += 1;
            }
                
        // X Only?
        } else if (this.velocity[1] == 0 && this.velocity[0] != 0) {
            if (this.velocity[0] > 0) {
                this.velocity[0] -= 1;
            } else {
                this.velocity[0] += 1;
            }
        }

        this.x += this.velocity[0] * 0.1;
        this.y -= this.velocity[1] * 0.1;
    }

    boost(bx, by) {
        if (Math.sqrt((this.velocity[0] ** 2) + (this.velocity[1] ** 2)) < 100) { // max speed
            this.velocity = [this.velocity[0] + bx, this.velocity[1] + by];
        }
    }
}

socket.on('handshake', function(data) {
    player = new Car(200, 200, socket.id);
    for (let i in data) {
        if (socket.id != i)
            players[i] = new Car(data[i][1][0], data[i][1][1], i);
    }
    connected = true;
});

socket.on('catchup', function(data) {
    if (data[0] == "connected") { // ['connected', socket.id, [200, 200], 0])
        players[data[1]] = new Car(data[2][0], data[2][1], data[3]);
    } else if (data[0] == "update") { // ['update', socket.id, data[0], data[1]] - data[0] loc - data[1] angle
        players[data[1]].x = data[2][0];
        players[data[1]].y = data[2][1];
        players[data[1]].angle = data[3];
    } else if (data[0] == "disconnect") {
        delete players[data[1]];
    }
});

function render() {
    for (let i = 0; i < scene.length; i++) {
        scene[i].render(player.x, player.y);
    }

    for (let i in players) {
        players[i].render(player.x, player.y);
    }

    player.player_render();
}

function calculate_vector(angle, constant) {
    if (angle <= 90) {
        bx = Math.sin(radians(angle)) * constant;
        by = Math.cos(radians(angle)) * constant;
    } else if (angle > 90 && angle <= 180) {
        bx = Math.cos(radians(angle - 90)) * constant;
        by = -1 * Math.sin(radians(angle - 90)) * constant;
    } else if (angle > 180 && angle <= 270) {
        bx = -1 * Math.sin(radians(angle - 180)) * constant;
        by = -1 * Math.cos(radians(angle - 180)) * constant;
    } else {
        bx = -1 * Math.cos(radians(angle - 270)) * constant;
        by = Math.sin(radians(angle - 270)) * constant;
    }

    return [bx, by];
}

function stat_render() {
    textSize(13);
    text("Tick: " + frameCount, 10, 20);
    text("Location: " + [Math.round(player.x), Math.round(player.y)], 10, 40);
    text("Angle: " + player.angle, 10, 60);
    text("Clients: " + (Object.keys(players).length + 1), 10, 80);
}

function keyControl() {
    if (controls['w']) {
        let vectors = calculate_vector(player.angle, 3); // check for vectors
        player.boost(vectors[0], vectors[1]);
    } else if (controls['s']) {
        let vectors = calculate_vector(player.angle, 2); // check for vectors
        player.boost(-vectors[0], -vectors[1]);
    }
    
    if (controls['a']) {
        if (player.angle - 5 < 0)
            player.angle = 360 + player.angle;
        player.angle -= 5;
    } else if (controls['d']) {
        if (player.angle + 5 > 360)
            player.angle = player.angle + 5 - 360;
        player.angle += 5;
    }
    
    socket.emit('update', [[player.x, player.y], player.angle])
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
    background(126, 200, 80);
    if (connected) {
        keyControl();
        render();
        stat_render();
        player.move_velocity();
    } else {
        fill(0);
        textSize(50);
        text("Connecting..", 375 - (textWidth("Connecting..") / 2), 100);
    }
}

/* FUNCTIONS */
function setup() {
    createCanvas(750, 700);
    rectMode(CENTER);
    player = new Car(0, 0);
}