var socket = io();
var scrollY = 0;

class main{
    constructor(screen = 'main'){
        this.screen = screen;
    }
}

main = new main();

function setup() {
    createCanvas(750, 700);
}

function draw() {
    background(255);
    push();
    textSize(32);
    render(250 , 200);
    pop();
    console.log(main.screen, mouseX, mouseY)
}


function render(x, y) {
    if (main.screen == 'main'){
        text('Welcome To ', x, y - 100);
        rect(x, y, 200, 50);
        rect(x, y + 100, 200, 50);
        rect(x, y + 200, 200, 50);
        text('Play', x, y, 200, 100);
        text('How to Play', x, y + 100, 200, 100);
        text('Credits', x, y + 200, 200, 100);
    }
    if (main.screen == 'play'){
        text('test', x, y , 200, 100);
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

