var socket = io();
var song;
var firing;

/* VARIABLES */
class main {
    constructor(screen = 'main') {
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

var seconds = 0;
var el = document.getElementById('seconds-counter');
var drift = [];

function incrementSeconds() {
    seconds += 1;
}

var cancel = setInterval(incrementSeconds, 10000);

var player,
    players = {},
    scene = [],
    connected = false,
    canon,
    shots = [];

class Car {
    constructor(x, y, id, type) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.velocity = [0, 0]; // x, y
        this.type = type;
        this.id = id;
        this.score = 0;
        this.driving = false;
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
            song.stop();
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
            song.play();
            strokeWeight(2);
            stroke(0);
            fill(255, 0, 0);
            rect(0, 0, 50, 100);
            noStroke();
            fill(251, 255, 17);
            rect(0, -37.5, 10, 5);
            rect(7.5, -25, 5, 25);
            rect(0, -12.5, 10, 5);
            rect(-12.5, -25, 5, 10);
            rect(5, -25, 30, 5);
            rect(-7.5, -10, 5, 10);
            triangle(-15, -30, -10, -35, -10, -30);
            noStroke();
            fill(0);
            rect(-26.5, -20, 3, 20);
            rect(-26.5, 30, 3, 20);
            rect(26.5, -20, 3, 20);
            rect(26.5, 30, 3, 20);

        } else if (this.type == 2) {
            song.stop();
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

        if (this.driving) {
            fill(255, 0, 0);
            triangle(24, 55, 8, 55, 16, 68);
            triangle(-24, 55, -8, 55, -16, 68);
            fill(255, 255, 0);
            triangle(20, 55, 12, 55, 16, 63);
            triangle(-20, 55, -12, 55, -16, 63);
        }

        fill(0);
    }

    rotate(angle) {
        this.angle += angle;
    }

    move_velocity() {
        let angle, friction;

        let t_x = player.x + (this.velocity[0] * 0.1),
            t_y = player.y - (this.velocity[1] * 0.1);
        if (t_x < -1975 || t_x > 1975 || t_y < -1975 || t_y > 1975)
            this.velocity = [0, 0];
        else if (this.velocity == [0, 0])
            return false;

        angle = degrees(Math.atan(Math.abs(this.velocity[0]) / Math.abs(this.velocity[1]))); // get the angle of the velocity
        friction = 1.5; // friction vector

        // TR 1
        if (this.velocity[0] > 0 && this.velocity[1] > 0) {
            this.velocity[0] -= Math.sin(radians(angle)) * friction;
            this.velocity[1] -= Math.cos(radians(angle)) * friction;
            if (this.velocity[0] < 0 || this.velocity[1] < 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
            quad = angle;
        // BR 2
        } else if (this.velocity[0] > 0 && this.velocity[1] < 0) {
            this.velocity[0] -= Math.sin(radians(angle)) * friction;
            this.velocity[1] += Math.cos(radians(angle)) * friction;
            if (this.velocity[0] < 0 || this.velocity[1] > 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
            quad = (90 - angle) + 90;
        // BL 3
        } else if (this.velocity[0] < 0 && this.velocity[1] < 0) {
            this.velocity[0] += Math.sin(radians(angle)) * friction;
            this.velocity[1] += Math.cos(radians(angle)) * friction;
            if (this.velocity[0] > 0 || this.velocity[1] > 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
            quad = 180 + angle;
        // TL 4
        } else if (this.velocity[0] < 0 && this.velocity[1] > 0) {
            this.velocity[0] += Math.sin(radians(angle)) * friction;
            this.velocity[1] -= Math.cos(radians(angle)) * friction;
            if (this.velocity[0] > 0 || this.velocity[1] < 0) {
                this.velocity[0] = 0;
                this.velocity[1] = 0;
            }
            quad = (90 - angle) + 270;
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

        for (let i in players) {
            if (dist(player.x + (this.velocity[0] * 0.1), player.y - (this.velocity[1] * 0.1), players[i].x, players[i].y) <= 25 + 25) {
                this.velocity = [0, 0];
            }
        }

        for (let i in scene) {
            let radius = 25;
            if (scene[i].type == 1)
                radius = 50;
            if (scene[i].type == 2)
                radius = 62.5;
            if (dist(player.x + (this.velocity[0] * 0.1), player.y - (this.velocity[1] * 0.1), scene[i].x, scene[i].y) <= 25 + radius) {
                this.velocity = [0, 0];
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

    calc_score() {
        this.score = seconds;
    }
}

class Scene {
    constructor(x, y, type) {
        this.type = type;
        this.x = x;
        this.y = y;
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
        } else if (this.type == 1) {
            noStroke()
            fill(24, 73, 24);
            ellipse(0, 0, 100, 100);
            fill(22, 117, 22);
            ellipse(0, 0, 62.5, 62.5);
            strokeWeight(1);
            stroke(0);
            fill(86, 47, 11);
            ellipse(0, 0, 25, 25);
        } else if (this.type == 2) {

            fill(150, 104, 40);
            noStroke();

            rect(0, 0, 50, 150);

            rotate(radians(45));
            rect(0, 0, 50, 150);

            rotate(radians(90));
            rect(0, 0, 50, 150);

            rotate(radians(-45));
            rect(0, 0, 50, 150);

            fill(86, 60, 33);
            stroke(0);
            strokeWeight(1);
            ellipse(0, 0, 50, 50);
        }
    }
}

class Canon {
    constructor() {
        this.angle = 0;
    }

    update_pos() {
        // this.angle += 1;
    }

    render() {
        this.follow();
        push();
        translate(375, 350);
        rotate(1.570796325);
        rotate(this.angle);
        strokeWeight(2);
        stroke(0);
        fill(81, 81, 67);
        rect(0, 0, 25, 30);
        rect(0, -17.5, 15, 5);
        pop();
    }

    follow() {
        let dir = (atan2(mouseY - (700 / 2), mouseX - (750 / 2)) - this.angle) / 6.2831853;
        dir = (dir - round(dir)) * 6.2831853;
        this.angle += (dir * 0.1);
    }
}

class Projectile {
    constructor(x, y, angle, currentLife) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.currentLife = currentLife;
        this.life = true;
    }

    checkLife() {
        this.currentTime = new Date().getTime();
        if (this.currentTime - this.currentLife >= 3000) {
            this.life = false;
        }
    }

    draw(off_x, off_y) {
        push();
        translate(this.x + 375 - off_x, this.y + 350 - off_y);
        rotate(1.570796325);
        rotate(this.angle);

        strokeWeight(1);
        fill(255);
        rect(0, 0, 10, 15);
    
        fill(255, 0, 0);
        triangle(0, -25, -10, -5, 10, -5);
    
        noStroke();
        triangle(0, 15, -5, 10, 5, 10);

        pop();
    }

    move() {
        this.x += 5 * cos(this.angle);
        this.y += 5 * sin(this.angle);
    }

    render(off_x, off_y) {
        this.checkLife();
        if (this.life == true) {
            this.move();
            this.draw(off_x, off_y);
        }
    }
}

socket.on('handshake', function(data) {
    for (let i in data[1]) {
        let obj = data[1][i];
        scene.push(new Scene(obj[0][0], obj[0][1], obj[1]));
    }

    for (let i in data[0]) {
        let car = data[0][i];
        if (socket.id != i)
            players[i] = new Car(car[1][0], car[1][1], i, car[3]);
        else {
            player = new Car(0, 0, socket.id, car[3]);
            canon = new Canon();
        }
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
    } else if (data[0] == "disconnect")
        delete players[data[1]];
});

function render() {
    push();
    fill(126, 200, 80);
    translate(375 - player.x, 350 - player.y);
    rect(0, 0, 4000, 4000);
    pop();

    removed = 0;
    fill(0);
    for (let i = 0; i < drift.length; i++) {
        if (drift[i][0] > 200) {
            delete drift[i];
            removed++;
        } drift[i][0]++;
        ellipse(drift[1][0] + 375 - player.x, drift[1][1] + 350 - player.y, 10, 10);
    }

    for (let i = 0; i < scene.length; i++) {
        scene[i].render(player.x, player.y);
    }

    for (let i in players) {
        players[i].render(player.x, player.y);
    }

    player.player_render();
    canon.render();
    canon.update_pos();
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
    textAlign(LEFT);
    text("Tick: " + frameCount, 10, 20);
    text("Location: " + [Math.round(player.x), Math.round(player.y)], 10, 40);
    text("Angle: " + player.angle, 10, 60);
    text("Clients: " + (Object.keys(players).length + 1), 10, 80);
    text("Score: " + player.score, 10, 100);
    pop();
}

function keyControl() {
    player.driving = false;
    
    if (controls['w']) {
        let vectors = calculate_vector(player.angle, 1.3); // check for vectors
        player.boost(vectors[0], vectors[1]);
        player.driving = true;
    } else if (controls['s']) {
        let drop_angle = player.angle - 180;
        if (player.angle - 180 < 0) 
            drop_angle = 180 + player.angle;
        let vectors = calculate_vector(drop_angle, 1.0); // check for vectors
        player.boost(vectors[0], vectors[1]);
    }

    let speed = Math.sqrt(player.velocity[0]**2 + player.velocity[1]**2)
    let turn_angle = (-(1 / 2750)) * ((speed - 50)**2) + 1.1;
    
    if (player.velocity[0] != 0 || player.velocity[1] != 0) {
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

function shoot() {
    firing.setVolume(0.1);
    firing.play();
    shots.push(new Projectile(player.x, player.y, canon.angle, new Date().getTime()));
}

function keyPressed() {
    if (keyCode == 32) {
        shoot();
    }
    
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
    textSize(32);
    if (main.screen != 'play')
        background(126, 200, 80)
    if (connected) {
        renderScreen(375, 200);
        if (main.screen == 'play') {
            background(0, 0, 255)
            keyControl();
            render();
            keyControl();
            renderScreen();
            stat_render();
            player.move_velocity();
            player.calc_score();
            for (let i in scene) {
                let radius = 25;
                if (scene[i].type == 1)
                    radius = 50;
                if (scene[i].type == 2)
                    radius = 75;
                for (n = 0; n < shots.length; n++) {
                    if (dist(shots[n].x + player.x, shots[n].y + player.y, scene[i].x, scene[i].y) <= 25 + radius)
                        shots.splice(n, 1);
                }
            }
            
            for (i = 0; i < shots.length; i++) {
                shots[i].render(player.x, player.y);
                if (shots[i].life == false)
                    shots.splice(i, 1);
            }
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
function style() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER)
}

function preload(){
    song = loadSound('song.mp3');
    firing = loadSound('firing.mp3')
}

function setup() {
    style()
    createCanvas(750, 700);
    song.setVolume(0.05);
    song.loop();
}

/**
 * Function to create text and text boxes
 * @param {integer} x - x position of center of screen
 * @param {integer} y - y position of center of screen
 */
function renderScreen(x, y) { 
    if (main.screen == 'main') {
        background(126, 200, 80)
        text('Welcome To Dread Fight', x, y - 100);
        rect(x, y, 200, 50);
        rect(x, y + 100, 200, 50);
        rect(x, y + 200, 200, 50);
        text('Play', x, y);
        text('How to Play', x, y + 100);
        text('Credits', x, y + 200);
    }
    if (main.screen == 'play') {
    }
    if (main.screen == 'howToPlay') {
        var keys = [['[W]', '- Forward'], ['[A]', '- Turn Left'],['[S]', '- Backward'], ['[D]', '- Turn Right']]
        for (i = 0; i < keys.length; i++) {
            text(keys[i][0] + ' ' + keys[i][1], x, y + ((i - 2) * 50));
        }
    }
    if (main.screen == 'credits') {
        text('By Makan, Gary & Anthony', x, scrollY + 200);
        text('A Top-Down Car Shooter',x, scrollY + 100)
        text('DREAD FIGHT', x, scrollY);
        scrollY -= 1;
    }
    if (main.screen == 'howToPlay' || main.screen == 'credits') {
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
    if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 180 && mouseY <= 230) && (main.screen == 'main'))
        main.screen = 'play';
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 280 && mouseY <= 330) && (main.screen == 'main'))
        main.screen = 'howToPlay';
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 380 && mouseY <= 430) && (main.screen == 'main'))
        main.screen = 'credits';
    else if ((mouseX >= 550 && mouseX <= 750) && (main.screen == 'howToPlay' || main.screen == 'credits') && (mouseY >= 650 && mouseY <= 700)) {
        main.screen = 'main';
        scrollY = 700;
    } 
    else if (main.screen == 'play')
        shoot();
    
}
