function communist(){
    push();
    translate(375, 350);

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
    fill(0)
    rect(-26.5, -20, 3, 20)
    rect(-26.5, 30, 3, 20)
    rect(26.5, -20, 3, 20)
    rect(26.5, 30, 3, 20)

    pop();
}
