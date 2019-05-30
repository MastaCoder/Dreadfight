function rocket(){
    /*
    cannon bullet:
        tri: b = 20, h = 20
        rect w = 10, h = 15
        fire: 
        2 pixels apart from the body
        b = 10, h = 5
    */
    push();
    translate(375,350);
    strokeWeight(1);
    fill(255);
    rect(0, 0, 10, 15);

    fill(255, 0, 0);
    triangle(0, -25, -10, -5, 10, -5);

    noStroke();
    triangle(0, 15, -5, 10, 5, 10);

}
