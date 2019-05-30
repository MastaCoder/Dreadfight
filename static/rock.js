function rock(){
    /*
    rock: radius 50
    shade: radius 15 , shade x = rock x + 12.5
    */
    push();
    translate(375,350);
    strokeWeight(1);
    stroke(0)
    fill(136, 147, 136);
    ellipse(0, 0, 50, 50);
    
    noStroke();
    fill(191, 201, 191);
    ellipse(12.5, -5, 15, 15);

    pop();
}
