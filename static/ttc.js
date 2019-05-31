function ttc(){
    //ttc
    push();
    translate(375, 350);
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

    pop();
}
