// Extract information 


// Parameters
var data = {};

var images = [];
var descriptions = [];

var references = [];

var images = [];

var limit = 150;               // Reference(image) size limit
var grid = 25;                 // Snap grid size
var gridOffset = grid / 2;

var scaleValue = 0;            // Initial scale value (false)

var offsetX, offsetY;          // Mouseclick offset

// Images preload function
function preload() {
    data = loadJSON('references.json', resultLoaded);
}  

function resultLoaded() {
    // Load Data
    let referenceData = data['references'];
    for (let i = 0; i < referenceData.length; i++) {
        console.log('loaded');
        let ref = referenceData[i]
        // Description
        let name = ref['Name'];
        let author = ref['Author'];
        let year = ref['Year'];
        let description = name.concat('. ', author, ' (', year, ')');
        descriptions.push(description);
        // Image file
        let imgURL = ref['URL'];
        let img = loadImage(imgURL);
        images.push(img);
    }
}

// Canvas setup
function setup() {
    var wW = windowWidth - 50;
    var wH = windowHeight - 50;
    createCanvas(wW, wH);
    background(0,0,0);
    for (let i = 0; i < images.length; i++) {
        let ref = new Reference(images[i], descriptions[i])
        references.push(ref);
    }
}

function draw() {
    clear();
    let dots = [];
    for (let i = 0; i < references.length; i++) {
        dots.push([references[i].x, references[i].y]);
    }
    for (let i = 0; i < dots.length; i++) {
        for (let j = 0; j < dots.length; j++) {
            if (i != j){
                strokeWeight(1);
                stroke(120, 120, 120, 50);
                line(dots[i][0], dots[i][1], dots[j][0], dots[j][1]);
            }
        }
    }
    for (let i = 0; i < references.length; i++) {
        references[i].isMouseOver();
        references[i].show();
    }
    /* strokeWeight(1);
    stroke(120, 120, 120, 50);
    line(0, 0, this.x, this.y); */
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
    constructor(img, title) {
        this.img = img;
        this.title = title
        // Ransom placement
        this.x = snap(random(windowWidth - limit - 50));
        this.y = snap(random(windowHeight - limit - 50));
        // Size limit
        if (img.width > limit) {
            this.w = limit;
            this.h = (img.height / (img.width / limit));
        } else if (img.height > limit) {
            this.h = limit;
            this.w = (img.width / (img.height / limit));
        } else {
            this.w = img.width;
            this.h = img.height;
        }
        // Interaction constraints
        this.rollover = false;
        this.dragged = false;
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
            // Dragging effect
        } else if (this.rollover) {
            // Rollover effect
            this.w = this.w*(1 + scaleValue);
            this.h = this.h*(1 + scaleValue);
        } else {
            // Normal effect
        }
        image(this.img, this.x, this.y, [this.w], [this.h]);
        textSize(12);
        strokeWeight(0);
        fill(120, 120, 120);
        text(this.title, this.x, this.y + this.h + 12, [this.w]);
    }
}

function windowResized() {
    var wW = windowWidth - 50;
    var wH = windowHeight - 50;
    // Resize sketch if browser changes
    resizeCanvas(wW, wH);
}