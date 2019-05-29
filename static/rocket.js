function rocket(){
    /*
    cannon bullet:
        tri: b = 20, h = 20
        rect w = 10, h = 15

        fire: 
        2 pixels apart from the body
        b = 10, h = 5
    */
    strokeWeight(1);
    fill(255);
    rect(5, 20, 10, 15);

    fill(255, 0, 0);
    triangle(10, 0, 0, 20, 20, 20);

    noStroke();
    triangle(5, 37, 15, 37, 10, 42);

}
