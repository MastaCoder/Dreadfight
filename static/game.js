/* 
______                    _  __ _       _     _   
|  _  \                  | |/ _(_)     | |   | |  
| | | |_ __ ___  __ _  __| | |_ _  __ _| |__ | |_ 
| | | | '__/ _ \/ _` |/ _` |  _| |/ _` | '_ \| __|
| |/ /| | |  __/ (_| | (_| | | | | (_| | | | | |_ 
|___/ |_|  \___|\__,_|\__,_|_| |_|\__, |_| |_|\__|
 - A top down car shooter.         __/ |          
 - Made by Makan, Anthony, & Gary |___/   

 */

// Base variables
var socket = io(),
    song, firing, deja, bg,
    current_drift = false,
    news = ["", 0],
    leaderboard = [];

/* ClASSES */

/**
 * Main class for the screen. 
*/
class main {
    // Function for the screen (?)
    constructor(screen = 'main') {
        this.screen = screen;
    }
}

/** class Car
    * @param {float} x - x coordinate of the player
    * @param {float} y - y coordinate of the player
    * @param {float} angele -  the angle of the player facing
    * @param {float} velocity - [velocity in x, velocity in y]
    * @param {integer} type - type of the object
    * @param {string} id - id of the client
    * @param {boolean} driving - if the player is driving
    * @param {boolean} reverse - if the player is reversing
*/

class Car {
    constructor(x, y, id, type) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.velocity = [0, 0]; // x, y
        this.type = type;
        this.id = id;
        this.driving = false;
        this.reverse = false;
    }

    //Function that moves player up
    move(up) {
        this.y -= up;
    }

    //Function that render player
    player_render() {
        push();
        translate(375, 350);
        rotate(radians(this.angle));
        this.draw();
        textSize(9);
        text(this.id.slice(0, 8), 0, -60);
        pop();
    }

    //Function that render player when turning
    render(off_x, off_y) {
        push();
        translate(this.x + 375 - off_x, this.y + 350 - off_y);
        rotate(radians(this.angle));
        this.draw();
        textSize(9);
        text(this.id.slice(0, 8), 0, -60);
        pop();
    }

    //render cars
    draw() {
        //skin 1
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

        //skin 2
        } else if (this.type == 1) {
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

         //skin 3
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

    //Function that rotates the car
    rotate(angle) {
        this.angle += angle;
    }

    //Function: calculate velocity
    move_velocity() {
        let angle, friction,
            quad = 0;

        //scene collision check
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

        //checking if the car is drifting
        if (quad > 0 && Math.abs(quad - this.angle) > 25) {
            if (!this.reverse) {
                drift.push([0, [this.x, this.y]]);
            }
            if (!current_drift && !this.reverse) {
                deja.setVolume(0.1);
                deja.play();
                current_drift = true;
            }
        //play audio while drifting
        } else {
            if (current_drift)
                deja.stop();
            current_drift = false;
        }

        //player collision check
        for (let i in players) {
            if (dist(player.x + (this.velocity[0] * 0.1), player.y - (this.velocity[1] * 0.1), players[i].x, players[i].y) <= 25 + 25) {
                this.velocity = [0, 0];
            }
        }

        //scene object collision check
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

    //Function that checks acceleration
    boost(bx, by) {
        if (Math.sqrt((this.velocity[0] ** 2) + (this.velocity[1] ** 2)) < 100) { // max speed
            this.velocity = [this.velocity[0] + bx, this.velocity[1] + by];
        }
    }

    //Calculating the curent speed of the player
    calc_speed() {
        let speed = Math.sqrt((this.velocity[0] ** 2) + (this.velocity[1] ** 2));
        if (speed == NaN || speed == 0) return 6;
        else return speed / 5;
    }
}
/** class Scene
* @param {double} x - x coordinate of the object
* @param {double} y - y corrdinate of the object
* @param {integer} type - stores which scenery object to draw
*/
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

    //Function that renders the scene objects
    draw() {
        //rock
        if (this.type == 0) {
            strokeWeight(1);
            stroke(0)
            fill(136, 147, 136);
            ellipse(0, 0, 50, 50);
            
            noStroke();
            fill(191, 201, 191);
            ellipse(12.5, -5, 15, 15);
            
        //tree
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
            
        //huts
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

/** 
* class Cannon 
* @param {double} angle -  the direction of the cannon pointing
*/
class Cannon {
    constructor() {
        this.angle = 0;
    }

    //Method to render the canon
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

    //Method to turn the canon based on the mouse position
    follow() {
        let dir = (atan2(mouseY - (700 / 2), mouseX - (750 / 2)) - this.angle) / 6.2831853;
        dir = (dir - round(dir)) * 6.2831853;
        this.angle += (dir * 0.1);
    }
}
/** class Projectile
 * @param {float} x - stores the x position of the projectile
 * @param {float} y - stores the y position of the projectile
 * @param {float} angle - stores the angle the projectile is fired from
 * @param {integer} currentLife - stores the time at which the projectile is shot
 * @param {boolean} life - stores whether or not the projectile is still 'alive'
 * @param {string} owner - stores the owner of the projectile fired
 * @param {integer} velocity - stores the velocity of the projectile
*/
class Projectile {
    constructor(x, y, angle, currentLife, owner, velocity) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.currentLife = currentLife;
        this.life = true;
        this.owner = owner;
        this.velocity = velocity;
    }
    
    //Method to check if the projectile has been present longer than its lifespan
    checkLife() {
        this.currentTime = new Date().getTime();
        if (this.currentTime - this.currentLife >= 3000) {
            this.life = false;
        }
    }

    //Method to draw the projectile
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

    //Method to move the projectile
    move() {
        if (this.velocity == [0, 0])
            return false;

        this.x += this.velocity[0] * 0.1;
        this.y -= this.velocity[1] * 0.1;
    }

    //Method to render the projectile drawing, movement & check if the projectile is still alive
    render(off_x, off_y) {
        this.checkLife();
        if (this.life) {
            this.move();
            this.draw(off_x, off_y);
        }
    }
}

/* FUNCTIONS */
function incrementSeconds() {
    seconds += 1;
}

/* VARIABLES */
main = new main(); // Main screen
scrolly = 700; // initial y position of scrolling text in credits screen

/** object to store what keys player is holding down */
var controls = {
    'w': false,
    'a': false,
    's': false,
    'd': false
};

// Base variables
var seconds = 0;
var el = document.getElementById('seconds-counter');
var drift = [];
var cancel = setInterval(incrementSeconds, 10000);

// Custom variables
var player,
    players = {},
    scene = [],
    connected = false,
    cannon,
    shots = []; // Stores all the projectiles fired in the game

/**
 * Socket function to check for initial handshake.
*/
socket.on('handshake', function(data) {
    // Map items
    for (let i in data[1]) {
        let obj = data[1][i];
        scene.push(new Scene(obj[0][0], obj[0][1], obj[1]));
    }

    // Car items
    for (let i in data[0]) {
        let car = data[0][i];
        if (socket.id != i) {
            players[i] = new Car(car[1][0], car[1][1], i, car[3]);
            console.log(i);
        } else {
            player = new Car(0, 0, socket.id, car[3]);
            cannon = new Cannon();
        }
    }

    // Player location is sent by the server.
    player.x = data[2][0];
    player.y = data[2][1];
    connected = true;
});

/**
 * Socket function to catchup with server data.
*/
socket.on('catchup', function(data) {
    if (data[0] == "connected") { // ['connected', socket.id, [200, 200], 0])
        players[data[1]] = new Car(data[2][0], data[2][1], data[1], data[4]);
    } else if (data[0] == "update") { // ['update', socket.id, data[0], data[1]] - data[0] loc - data[1] angle
        players[data[1]].x = data[2][0];
        players[data[1]].y = data[2][1];
        players[data[1]].angle = data[3];
    } else if (data[0] == "disconnect")
        delete players[data[1]];
    else if (data[0] == 'shot') { // ['shot', [x, y], angle, owner, speed]
        shots.push(new Projectile(data[1][0], data[1][1], data[2], new Date().getTime(), data[3], data[4], data[5]));
    }
});

/**
 * Leaderboard socket function.
*/
socket.on('leaderboard', function(data) {
    leaderboard = data; // Update data
});

/**
 * News is recieved from the server.
*/
socket.on('news', function(data) {
    news[0] = data;
    news[1] = 2000;
});

/* CUSTOM FUNCTIONS */

/**
 * Main screen styling for text
*/
function style() {
    rectMode(CENTER); // Center rects and text.
    textAlign(CENTER, CENTER)
}

/**
 * Preload audio to the screen
*/
function preload(){
    // Song files.
    bg = loadImage("assets/bg.png");
    song = loadSound('assets/song.mp3');
    firing = loadSound('assets/firing.mp3');
    deja = loadSound('assets/drift.mp3');
}

/**
 * Custom function to render on the screen.
*/
function render() {
    // Rendering for the map
    push();
    fill(126, 200, 80);
    translate(375 - player.x, 350 - player.y);
    rect(0, 0, 4000, 4000);
    pop();

    // Drifting render
    removed = 0;
    fill(0);
    for (let i = 0; i < drift.length; i++) {
        if (drift[i - removed][0] > 50) {
            drift.splice(i - removed, 1); // Remove drift from the screen
            removed++;
        } else {
            drift[i - removed][0]++; // Add drift line
            ellipse(drift[i - removed][1][0] + 375 - player.x, drift[i - removed][1][1] + 350 - player.y, 50, 10); 
        }
    }

    // Canon and player render
    player.player_render();
    cannon.render();

    // Shot render
    for (let i in shots)
        shots[i].render(player.x, player.y);

    // Other player rendering
    for (let i in players)
        players[i].render(player.x, player.y);
    
    // Scene rendering
    for (let i = 0; i < scene.length; i++)
        scene[i].render(player.x, player.y);

    // Leaderboard rendering
    push();
    textSize(20);
    fill(0);
    text("Leaderboard", 675, 575);
    pop();
    for (let i in leaderboard) {
        push();
        textSize(15);
        textAlign(RIGHT);
        text(leaderboard[i][0] + " - " + leaderboard[i][1].slice(0, 8), 730, 600 + (i * 20));
        pop();
    }

    if (news[1] > 0) {
        push();
        fill(0);
        textAlign(LEFT);
        textSize(30);
        text(news[0], 10, 670);
        pop();
        news[1]--;
    }
}

/**
 * Function to create text and text boxes
 * @param {integer} owner - angle of the the vector
 * @param {integer} constant - constant for the vector
*/
function calculate_vector(angle, constant) {
    if (angle <= 90) { // T1
        bx = Math.sin(radians(angle)) * constant;
        by = Math.cos(radians(angle)) * constant;
    } else if (angle > 90 && angle <= 180) { // T2
        bx = Math.cos(radians(angle - 90)) * constant;
        by = -1 * Math.sin(radians(angle - 90)) * constant;
    } else if (angle > 180 && angle <= 270) { // T3
        bx = -1 * Math.sin(radians(angle - 180)) * constant;
        by = -1 * Math.cos(radians(angle - 180)) * constant;
    } else { // T4
        bx = -1 * Math.cos(radians(angle - 270)) * constant;
        by = Math.sin(radians(angle - 270)) * constant;
    }

    return [bx, by];
}

/**
 * Render the mini stats onto screen.
*/
function stat_render() {
    push();
    textSize(13);
    textAlign(LEFT);

    // Render text
    text("Tick: " + frameCount, 10, 20);
    text("Location: " + [Math.round(player.x), Math.round(player.y)], 10, 40);
    text("Angle: " + round(player.angle), 10, 60);
    text("Clients: " + (Object.keys(players).length + 1), 10, 80);
    pop();
}

/**
 * Custom key function to run every tick.
*/
function keyControl() {
    player.driving = false; // default not driving
    
    if (controls['w']) { // Boost forward
        let vectors = calculate_vector(player.angle, 1.1); // check for vectors
        player.boost(vectors[0], vectors[1]); // Boost vector
        player.driving = true; // Player is driving
        player.reverse = false; // Not reversing

    } else if (controls['s']) { // Reverse
        let drop_angle = player.angle - 180; // Reverse the angle
        // Calculations
        if (player.angle - 180 < 0) 
            drop_angle = 180 + player.angle;
        let vectors = calculate_vector(drop_angle, 1.0); // check for vectors
        player.boost(vectors[0], vectors[1]);
        player.reverse = true; // Player is reversing
    }

    // Speed calculations and turn angles
    let speed = Math.sqrt(player.velocity[0]**2 + player.velocity[1]**2)
    let turn_angle = (-(1 / 2750)) * ((speed - 50)**2) + 1.1;
    
    // Don't allow turning when stopped.
    if (player.velocity[0] != 0 || player.velocity[1] != 0) {
        if (controls['a']) { // Left
            if (player.angle - turn_angle < 0)
                player.angle = 360 + player.angle;
            player.angle -= turn_angle;
        } else if (controls['d']) { // Right
            if (player.angle + turn_angle > 360)
                player.angle = player.angle + turn_angle - 360;
            player.angle += turn_angle;
        }
    }

    socket.emit('update', [[player.x, player.y], player.angle]); // Update the player angle
}

/**
 * Function to calculate and boost the rocket.
*/
function shoot() {
    // Play firing sound.
    firing.setVolume(0.1);
    firing.play();
    
    // Calculate the vector
    let total = Math.sqrt((player.velocity[0] ** 2) + (player.velocity[1] ** 2));
    if (total == 0) total = 1;
    total += 50;
    let vect = calculate_vector(degrees(cannon.angle) + 90, total);

    // Add the vector
    shots.push(new Projectile(player.x, player.y, cannon.angle, new Date().getTime(), player.id, vect));
    socket.emit("shot", [[player.x, player.y], cannon.angle, player.id, vect]); // Send to server
}

/**
 * Check shot collisions with scenes
*/
function checkSceneCollision(){
    for (let i in scene) { // Loop through scenery
        let radius = 25; // Check for radius
        if (scene[i].type == 1)
            radius = 50;
        if (scene[i].type == 2)
            radius = 75;
        for (n = 0; n < shots.length; n++) { // Loop through the shots
            if (dist(shots[n].x, shots[n].y, scene[i].x, scene[i].y) <= 25 + radius) { // Anything collide?
                shots.splice(n, 1); // Remove shot
                scene[i].health -= 1; // Reduce health
            }
        }
    }
}

/**
 * Check if a shot has hit a player.
*/
function checkShot() {
    for (let n in shots) { // Loop through shots
        if (shots[n].owner != player.id && dist(shots[n].x, shots[n].y, player.x, player.y) <= 25 + 15) { // Check collision with player
            dead(shots[n].owner); // Kill the player
        }
    }
}

/**
 * Function to create text and text boxes
 * @param {string} owner - person that killed the player
*/
function dead(owner) {
    socket.emit("score", [owner, 10]); // params [killer, score_inc]
    main.screen = "dead"; // move to death screen.
    socket.disconnect(); // Disconnect from socket.
}

/**
 * Function to create text and text boxes
 * @param {integer} increase - How much to increase the score
*/
function increase_score(increase) {
    socket.emit("score", [player.id, increase]); // Emit the score
}

/** 
 * Clears destroyed environment from scenery list 
*/
function clearSceneList() {
    for (i = 0; i < scene.length; i++){
        if (scene[i].health <= 0)
            scene.splice(i, 1);
    }
}

/**
 * Clear projectiles when their lifetime is up.
*/
function clearProjectilesList(){
    for (i = 0; i < shots.length; i++) { // Loop through all
        if (shots[i].life == false) // Still have life?
            shots.splice(i, 1); // Remove them
    }
}

/**
 * Function to create text and text boxes
 * @param {integer} x - x position of center of screen
 * @param {integer} y - y position of center of screen
*/
function renderScreen(x, y) { 
    // Main menu
    if (main.screen == 'main') {
        // Misc
        background(126, 200, 80);
        image(bg, 0, 0);
        text('Welcome To Dread Fight', x, y - 100);
        
        // Buttons
        rect(x, y, 200, 50);
        rect(x, y + 100, 200, 50);
        rect(x, y + 200, 200, 50);
        text('Play', x, y);
        text('How to Play', x, y + 100);
        text('Credits', x, y + 200);
    }

    // Death screen
    if (main.screen == 'dead') {
        background(255, 0, 0);
        fill(200);
        rect(x, y + 200, 200, 50);
        fill(0);
        text('You died!', x, y - 100);
        text('Retry', x, y + 200);
    }

    // Play screen
    if (main.screen == 'play')
        song.stop(); // stop the music
    
    // How to play screen
    if (main.screen == 'howToPlay') {
        image(bg, 0, 0);
        var keys = [['[W]', '- Forward'], ['[A]', '- Turn Left'], ['[S]', '- Backward'], ['[D]', '- Turn Right'], ['MOUSE', '- AIM'], ['[SPACE]', '- FIRE']]; // Controls
        for (i = 0; i < keys.length; i++) // Draw to screen
            text(keys[i][0] + ' ' + keys[i][1], x, y + ((i - 2) * 50));
    }

    // Credits
    if (main.screen == 'credits') {
        image(bg, 0, 0);
        text('By Makan, Gary & Anthony', x, scrollY + 200);
        text('A Top-Down Car Shooter',x, scrollY + 100)
        text('DREAD FIGHT', x, scrollY);
        scrollY -= 1; // Scroll down
    }

    // How to play and credits
    if (main.screen == 'howToPlay' || main.screen == 'credits') {
        // Button to return to the menu
        push();
        textSize(40);
        rectMode(CORNER);
        textAlign(LEFT, TOP)
        rect(550, 650, 200, 100);
        text('Go Back', 550, 650, 200, 100);
        pop();
    }
}

/** 
 * Function that is run when the mouse is pressed.
*/

function mousePressed() {
    // Main menu
    if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 180 && mouseY <= 230) && (main.screen == 'main'))
        main.screen = 'play'; // Play button
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 280 && mouseY <= 330) && (main.screen == 'main'))
        main.screen = 'howToPlay'; // How to play button
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 380 && mouseY <= 430) && (main.screen == 'main'))
        main.screen = 'credits'; // Credits button

    // Death screen
    else if ((mouseX >= 280 && mouseX <= 480) && (mouseY >= 380 && mouseY <= 430) && (main.screen == 'dead'))
        window.location.reload(); // Retry
    
    // Other screens
    else if ((mouseX >= 550 && mouseX <= 750) && (main.screen == 'howToPlay' || main.screen == 'credits') && (mouseY >= 650 && mouseY <= 700)) {
        main.screen = 'main'; // Return to main menu
        scrollY = 700; // For credits (?)
    }

    // Otherwise, if playing
    else if (main.screen == 'play')
        shoot(); // SHOOT
}

/* MAIN FUNCTIONS */

/**
 * Function that is run on setup
*/
function setup() {
    style(); // Styling
    createCanvas(750, 700); // Canvas size
    // Menu music
    song.setVolume(0.1);
    song.play();
    song.loop();
}

/**
 * Function run when drawing to the screen.
*/
function draw() {
    textSize(32); // Larger text
    if (main.screen != 'play') // Screen is not playing
        background(126, 200, 80) // Green color of background
    if (connected) { // When connected to the socket
        renderScreen(375, 200);
        if (main.screen == 'play') { // Connected and playing
            background(0, 0, 255); // Water background
            // Functions run when playing
            keyControl();
            render();
            keyControl();
            renderScreen();
            stat_render();
            player.move_velocity();
            checkSceneCollision();
            checkShot();
            clearProjectilesList();
            clearSceneList();
        }
    } else { // Connecting to socket
        push();
        fill(0); // black
        textSize(50); // Large text
        text("Connecting..", 375 - (textWidth("Connecting..") / 2), 100); // Mark as connecting
        pop();
    }

    // If playing, every 500 ticks increase score
    if (frameCount % 500 == 0 && main.screen == "play")
        increase_score(1); // Update player score.
}

/**
 * Function that is run when a key is pressed.
*/
function keyPressed() {
    if (keyCode == 32) // spacebar
        shoot();
    if (key.toLowerCase() in controls) 
        controls[key.toLowerCase()] = true; // update controls array when pressed
    return false;
}

/**
 * Function that is run when a key is released.
*/
function keyReleased() {
    if (key.toLowerCase() in controls)
        controls[key.toLowerCase()] = false; // update controls array when released
    return false; // mark key as not pressed
}