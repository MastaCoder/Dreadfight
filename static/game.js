var socket = io();

// socket.on('stuff', function(data) {
//     console.log(data);
//     rect(data[0], data[1], 25, 25);
// });

/* VARIABLES */
class main{
    constructor(screen = 'main'){
        this.screen = screen;
    }
}

main = new main();
scrolly = 700;

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
    constructor(x, y, id, type) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.velocity = [0, 0]; // x, y
        this.type = type;
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
        if (this.type == 0) {
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
            fill(0);
            rect(-26.5, -20, 3, 20);
            rect(-26.5, 30, 3, 20);
            rect(26.5, -20, 3, 20);
            rect(26.5, 30, 3, 20);
        } else if (this.type == 1) {
            strokeWeight(2);
            stroke(0);
            fill(255, 0, 0);
            rect(0, 0, 50, 100);
            noStroke();
            fill(251, 255, 17);
            rect(0, -12.5, 10, 5);
            rect(7.5, 0, 5, 25);
            rect(0, 12.5, 10, 5);
            rect(-12.5, 0, 5, 10);
            rect(5, 0, 30, 5);
            rect(-7.5, 15, 5, 10);
            triangle(-15, -5, -10, -10, -10, -5);
            noStroke();
            fill(0);
            rect(-26.5, -20, 3, 20);
            rect(-26.5, 30, 3, 20);
            rect(26.5, -20, 3, 20);
            rect(26.5, 30, 3, 20);
        } else if (this.type == 2) {
            strokeWeight(1)
            fill(255);
            rect(0, 0, 50, 100);
            
            noStroke();
            fill(255, 0, 0);
            rect(20, 0, 10, 100);
            rect(-20, 0, 10, 100);
            rect(0, 45, 30, 10);

            fill(0)
            rect(0, 0, 10, 100);
            rect(12.5, -45, 5, 10);
            rect(-12.5, -45, 5, 10);

            fill(0, 0, 255);
            rect(-7.5, -45, 5, 10);
            rect(7.5, -45, 5, 10);

            fill(244, 241, 66);
            rect(20, 45, 10, 10);
            rect(-20, 45, 10, 10);

            fill(0)
            rect(-26.5, -20, 3, 20)
            rect(-26.5, 30, 3, 20)
            rect(26.5, -20, 3, 20)
            rect(26.5, 30, 3, 20)
        }
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

        friction = 1.5; // friction vector

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

class Scene {
    constructor(x, y, type, size) {
        this.type = 0;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    render(off_x, off_y) {
        push();
        translate(this.x + 375 - off_x, this.y + 350 - off_y);
        this.draw();
        pop();
    }

    draw() {
        if (this.type == 0) {
            strokeWeight(1);
            stroke(0)
            fill(136, 147, 136);
            ellipse(0, 0, 50, 50);
            
            noStroke();
            fill(191, 201, 191);
            ellipse(12.5, -5, 15, 15);
        }
    }
}

socket.on('handshake', function(data) {
    for (let i in data[1]) {
        let obj = data[1][i];
        scene.push(new Scene(obj[0][0], obj[0][1], 0, 100));
    }

    for (let i in data[0]) {
        let car = data[0][i];
        if (socket.id != i)
            players[i] = new Car(car[1][0], car[1][1], i, car[3]);
        else
            player = new Car(0, 0, socket.id, car[3]);
    }

    connected = true;
});

socket.on('catchup', function(data) {
    if (data[0] == "connected") { // ['connected', socket.id, [200, 200], 0])
        players[data[1]] = new Car(data[2][0], data[2][1], data[3], data[4]);
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
    push();
    textAlign(LEFT);
    textSize(13);
    text("Tick: " + frameCount, 10, 20);
    text("Location: " + [Math.round(player.x), Math.round(player.y)], 10, 40);
    text("Angle: " + player.angle, 10, 60);
    text("Clients: " + (Object.keys(players).length + 1), 10, 80);
    pop();
}

function keyControl() {
    if (controls['w']) {
        let vectors = calculate_vector(player.angle, 2.2); // check for vectors
        player.boost(vectors[0], vectors[1]);
    } else if (controls['s']) {
        let drop_angle = player.angle - 180;
        if (player.angle - 180 < 0) 
            drop_angle = 180 + player.angle;
        let vectors = calculate_vector(drop_angle, 1.6); // check for vectors
        player.boost(vectors[0], vectors[1]);
    }
    
    if (player.velocity[0] != 0 || player.velocity[1] != 0) {
        let turn_angle = -1 * ((Math.sqrt(player.velocity[0]**2 + player.velocity[1]**2) / 70) ** 2) + 2.8;
        if (controls['a']) {
            if (player.angle - turn_angle < 0)
                player.angle = 360 + player.angle;
            player.angle -= turn_angle;
        } else if (controls['d']) {
            if (player.angle + turn_angle > 360)
                player.angle = player.angle + turn_angle - 360;
            player.angle += turn_angle;
        }
    }
    
    socket.emit('update', [[player.x, player.y], player.angle])
}

function keyPressed() {
    if (key.toLowerCase() in controls)
        controls[key.toLowerCase()] = true;
    return false;
}

function keyReleased() {
    if (key.toLowerCase() in controls)
        controls[key.toLowerCase()] = false;

    return false;
}

function draw() {
    background(126, 200, 80);
    textSize(32);
    if (connected) {
        renderScreen(375, 200);
        if (main.screen == 'play'){
            keyControl();
            render();
            keyControl();
            render();
            stat_render();
            player.move_velocity();
        }
    } else {
        push();
        fill(0);
        textSize(50);
        text("Connecting..", 375 - (textWidth("Connecting..") / 2), 100);
        pop();
    }
}

/* FUNCTIONS */
/** Function to change preferred settings applied throughout the project */
function style(){
    rectMode(CENTER);
    textAlign(CENTER, CENTER)
}

function setup() {
    style()
    createCanvas(750, 700);
}

/**
 * Function to create text and text boxes
 * @param {integer} x - x position of center of screen
 * @param {integer} y - y position of center of screen
 */
function renderScreen(x, y) { 
    if (main.screen == 'main'){
        text('Welcome To Dread Fight', x, y - 100);
        rect(x, y, 200, 50);
        rect(x, y + 100, 200, 50);
        rect(x, y + 200, 200, 50);
        text('Play', x, y);
        text('How to Play', x, y + 100);
        text('Credits', x, y + 200);
    }
    if (main.screen == 'play'){
    }
    if (main.screen == 'howToPlay'){
        var keys = [['[W]', '- Forward'], ['[A]', '- Turn Left'],['[S]', '- Backward'], ['[D]', '- Turn Right']]
        for (i = 0; i < keys.length; i++){
            text(keys[i][0] + ' ' + keys[i][1], x, y + ((i - 2) * 50));
        }
    }
    if (main.screen == 'credits'){
        text('By Makan, Gary & Anthony', x, scrollY + 200);
        text('A Top-Down Car Shooter',x, scrollY + 100)
        text('DREAD FIGHT', x, scrollY);
        scrollY -= 1;
    }
    if (main.screen == 'howToPlay' || main.screen == 'credits'){
        push();
        textSize(40);
        rectMode(CORNER);
        textAlign(LEFT, TOP)
        rect(550, 650, 200, 100);
        text('Go Back', 550, 650, 200, 100);
        pop();
    }
}

/** Function to change game state based on location of mouse click */
function mousePressed() {
    if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 180 && mouseY <= 230) && (main.screen == 'main')){
        main.screen = 'play';
    }
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 280 && mouseY <= 330) && (main.screen == 'main')){
        main.screen = 'howToPlay';
    }
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 380 && mouseY <= 430) && (main.screen == 'main')){
        main.screen = 'credits';
    }
    else if ((mouseX >= 550 && mouseX <= 750) && (main.screen == 'howToPlay' || main.screen == 'credits') && (mouseY >= 650 && mouseY <= 700)){
        main.screen = 'main';
        scrollY = 700;
    }
}
