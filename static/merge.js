var socket = io();
var scrollY = 0;

class main{
    constructor(screen = 'main'){
        this.screen = screen;
    }
}

main = new main();

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
        this.angle = 0;
        this.velocity = [0, 0]; // x, y
        this.type = 0;
    }

    move(up, right) {
        this.y -= up;
    }

    player_render() {
        push();
        translate(375, 350);
        rotate(radians(this.angle));
        rect(0, 0, 50, 100);
        pop();
    }

    render(off_x, off_y) {
        // movement
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

        console.log(angle, " - ", Math.abs(this.velocity[0]) / Math.abs(this.velocity[1]));

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
        // console.log(this.velocity[0], this.velocity[1]);
    }

    boost(bx, by) {
        if (Math.sqrt((this.velocity[0] ** 2) + (this.velocity[1] ** 2)) < 100) { // max speed
            this.velocity = [this.velocity[0] + bx, this.velocity[1] + by];
        }
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
    player = new Car(0, 0);
    scene.push(new Tree(10, 10))
}

function render() {
    for (let i = 0; i < scene.length; i++) {
        scene[i].render(player.x, player.y);
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

function keyControl() {
    if (controls['w']) {
        let vectors = calculate_vector(player.angle, 3); // check for vectors
        player.boost(vectors[0], vectors[1]);
    } else if (controls['s']) {
        let vectors = calculate_vector(player.angle, 2); // check for vectors
        player.boost(-vectors[0], -vectors[1]);
    }


    // if controls['a']: # left
    //     if ship.angle - 5 < 0:
    //         ship.angle = 360 + (ship.angle)
    //     ship.angle -= 5
    // if controls['d']: # right
    //     if ship.angle + 5 > 360:
    //         ship.angle = (ship.angle + 5 - 360)
    //     ship.angle += 5
    
    if (controls['a']) {
        if (player.angle - 5 < 0)
            player.angle = 360 + player.angle;
        player.angle -= 5;
    } else if (controls['d']) {
        if (player.angle + 5 > 360)
            player.angle = player.angle + 5 - 360;
        player.angle += 5;
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
    if (main.screen == 'play'){
        keyControl();
        render();
        player.move_velocity();
    }
    push();
    textSize(32);
    render1(250 , 200);
    pop();
    console.log(main.screen, mouseX, mouseY)
}


function render1(x, y) {
    if (main.screen == 'main'){
        text('Welcome To ', x, y - 100);
        push()
        rectMode(CORNER)
        rect(x, y, 200, 50);
        rect(x, y + 100, 200, 50);
        rect(x, y + 200, 200, 50);
        text('Play', x, y, 200, 100);
        text('How to Play', x, y + 100, 200, 100);
        text('Credits', x, y + 200, 200, 100);
        pop()
    }
    if (main.screen == 'play'){
    }
    if (main.screen == 'howToPlay'){
        var keys = [['[W]', 'Forward'], ['[A]', 'Turn Left'],]
        for (i = 0; i < keys.length; i++){
            text(keys[i][0] + ' ' + keys[i][1], x, y + ((i - 2) * 50));
        }
    }
    if (main.screen == 'credits'){
        text('A Game by Makan, Gary & Anthony', x - 100, scrollY);
        scrollY += 1;
    }
    if (main.screen == 'howToPlay' || main.screen == 'credits'){
        push();
        textSize(40)
        push()
        rectMode(CORNER)
        rect(550, 650, 200, 100);
        text('Go Back', 550, 650, 200, 100);
        pop();
    }
}

function mousePressed() {
    if ((mouseX >= 250 && mouseX <= 450) && (mouseY >= 200 && mouseY <= 250) && (main.screen == 'main')){
        main.screen = 'play';
    }
    else if ((mouseX >= 250 && mouseX <= 450) && (mouseY >= 300 && mouseY <= 350) && (main.screen == 'main')){
        main.screen = 'howToPlay';
    }
    else if ((mouseX >= 250 && mouseX <= 450) && (mouseY >= 400 && mouseY <= 450) && (main.screen == 'main')){
        main.screen = 'credits';
    }
    else if ((mouseX >= 550 && mouseX <= 750) && (main.screen == 'howToPlay' || main.screen == 'credits') && (mouseY >= 650 && mouseY <= 700)){
        main.screen = 'main';
        scrollY = 0;
    }
}

