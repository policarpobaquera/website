// Canvas
var dragging = false; // Is the object being dragged?
var rollover = false; // Is the mouse over the image?

var x, y, w, h;       // Location and size
var offsetX, offsetY; // Mouseclick offset

var grid = 25;
var gridOffset = grid / 2;

function setup() {
    wW = windowWidth - 50;
    wH = windowHeight - 50;
    createCanvas(wW, wH);
    // Grid

    // Rectangle
    // Dimensions
    w = 75;
    h = 50;
    // Initial location
    x = (wW / 2) - (w / 2);
    y = (wH / 2) - (h / 2);
}

function draw() {
    background(255);

    // Is mouse over object
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        rollover = true;
    }
    else {
        rollover = false;
    }

    // Adjust location if being dragged
    if (dragging) {
        x = snap(mouseX + offsetX);
        y = snap(mouseY + offsetY);
    }

    // Different fill based on state
    if (dragging) {
        fill('#30ffc8');
    } else if (rollover) {
        fill('#30ffc8');
    } else {
        fill('#00c38f');
    }
    strokeWeight(0);
    rect(x, y, w, h);
}

function windowResized() {
    wW = windowWidth - 50;
    wH = windowHeight - 50;
    resizeCanvas(wW, wH);
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
    // Image zoom
    if (rollover == true) {
        if (event.delta < 0) {
            w *= 1.1;
            h *= 1.1
        } else {
            w /= 1.1;
            h /= 1.1;
        }
    }
}

function mousePressed() {
    // Did I click on the rectangle?
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        dragging = true;
        // If so, keep track of relative location of click to corner of rectangle
        offsetX = x - mouseX;
        offsetY = y - mouseY;
    }
}

function mouseReleased() {
    // Quit dragging
    dragging = false;
}