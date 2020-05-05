// Canvas
var x, y, w;
var references = [];

var wheel = false;
var scaleValue = 0;

var offsetX, offsetY; // Mouseclick offset

var grid = 25;
var gridOffset = grid / 2;

function setup() {
    wW = windowWidth - 50;
    wH = windowHeight - 50;
    createCanvas(wW, wH);

    // Initialization
    for (let i = 0; i < 10; i++) {
        let x = random(wW);
        let y = random(wH);
        let w = random(75, 150);
        let ref = new Reference(x, y, w);
        references.push(ref);
    }
}

function draw() {
    background(255);
    for (let i = 0; i < references.length; i++) {
        references[i].isMouseOver();
        references[i].show();
    }
    scaleValue = 0;
}

function snap(op) {
    // subtract offset (to center lines)
    // divide by grid to get row/column
    // round to snap to the closest one
    var cell = Math.round((op - gridOffset) / grid);
    // multiply back to grid scale
    // add offset to center
    return cell * grid + gridOffset;
}

function mouseWheel(event) {
    if (event.delta > 0) {
        scaleValue = -0.1;
    } else if (event.delta < 0) {
        scaleValue = 0.1;
    }
}

function mousePressed() {
    for (let i = 0; i < references.length; i++) {
        references[i].clicked(mouseX, mouseY);
    }
}

function mouseDragged() {
    for (let i = 0; i < references.length; i++) {
        if (references[i].dragged) {
            references[i].move();
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < references.length; i++) {
        references[i].rollover = false;
        references[i].dragged = false;
    }
}

class Reference {
    constructor(x, y, w) { //img, title) {
        this.x = snap(x);
        this.y = snap(y);
        this.w = w;
        this.h = 75;
        this.rollover = false;
        this.dragged = false;
        //this.img = img;
        //this.title = title;
    }

    move() {
        this.x = snap(mouseX + offsetX);
        this.y = snap(mouseY + offsetY);
    }

    isMouseOver() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y
            && mouseY < this.y + this.h) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    clicked(mouseX, mouseY) {
        // Did I click on the reference?
        if (mouseX > this.x && mouseX < this.x + this.w &&
            mouseY > this.y && mouseY < this.y + this.h) {
            this.dragged = true;
            offsetX = this.x - mouseX;
            offsetY = this.y - mouseY;
        }
    }

    show() {
        if (this.dragged) {
            fill(0, 255, 188, 50);
        } else if (this.rollover) {
            fill(0, 255, 188);
            this.w *= (1 + scaleValue);
            this.h *= (1 + scaleValue);
            console.log('rollover');
        } else {
            fill(3, 165, 122);
        }
        strokeWeight(0);
        rect(this.x, this.y, this.w, this.h);
    }
}

function windowResized() {
    // Resize sketch if browser changes
    wW = windowWidth - 50;
    wH = windowHeight - 50;
    resizeCanvas(wW, wH);
}