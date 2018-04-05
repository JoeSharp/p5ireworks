let rubiksCube;

let displayInfo = {
    axisFilter : -1,
    cubeFilter : -1,
    sideHighlight : INTERNAL_SIDE,

    reset() {
        this.axisFilter = -1;
        this.cubeFilter = -1;
        this.sideHighlight = INTERNAL_SIDE;
    },

    incrementSideHighlight() {
        this.sideHighlight++;
        this.sideHighlight %= SIDES.length;
    },

    decrementSideHighlight() {
        this.sideHighlight--;
        if (this.sideHighlight < 0) {
            this.sideHighlight = SIDES.length-1;
        }
    }, 
    
    checkCubeFilter(c, ci) {
        return ((this.cubeFilter === -1) || ((ci % 9) === this.cubeFilter));
    },

    checkSideFilter(c, ci) {
        if (this.sideHighlight > INTERNAL_SIDE) {
            return rubiksCube.sides[this.sideHighlight].filter(sc => {
                return (sc.x === c.position.x) && (sc.y === c.position.y) && (sc.z === c.position.z);
            }).length > 0;
        }

        return false;
    }
}

let time = 0.5;
const TIME_SPEED = 0.02;
const ROTATE_INCREMENT = Math.PI / 8;

const COLOURS = {};

const BLOCK_SIZE = 50;

function setup() {
    createCanvas(400, 400, WEBGL);
    colorMode(RGB);

    strokeWeight(8);

    rubiksCube = new RubiksCube();
    //rubiksCube.rotateCube(createVector(-ROTATE_INCREMENT, ROTATE_INCREMENT, 0));
    console.log('Rubiks Cube', rubiksCube);

    COLOURS[INTERNAL_SIDE] = color('black');

    let colourValues = ['white', 'yellow', 'green', 'blue', 'orange', 'red'];
    let colourIndex = 0;
    SIDES.forEach((s, si) => {
        COLOURS[si] = colourValues[colourIndex++];
    });
}

function draw() {
    background(51);

    // This is the user controlled rotation
    rotateX(rubiksCube.rotation.x);
    rotateY(rubiksCube.rotation.y);
    rotateZ(rubiksCube.rotation.z);

    // I want it to spin around it's middle
    translate(-BLOCK_SIZE/2,-BLOCK_SIZE/2,-BLOCK_SIZE/2)

    time += TIME_SPEED;

    rubiksCube.update();

    rubiksCube.cubelets
        .forEach((c, ci) => {
            push();

            if (displayInfo.checkSideFilter(c, ci)) {
                stroke('pink');
            } else {
                stroke('black');
            }

            translate(
                c.position.x * BLOCK_SIZE, 
                c.position.y * BLOCK_SIZE, 
                c.position.z * BLOCK_SIZE
            );

            c.sidePanels.forEach((s, si) => {
                beginShape();

                if (displayInfo.checkCubeFilter(c, ci)) {
                    fill(COLOURS[s.side]);
                } else {
                    noFill();
                }

                s.vertices.forEach((v, vi) => {
                    vertex(v.x * BLOCK_SIZE, v.y * BLOCK_SIZE, v.z * BLOCK_SIZE);
                });
                endShape(CLOSE);
            });

            pop();
        });
}

function keyPressed() {
    if ((keyCode >= 49) && (keyCode <= 57)) { // 1-9
        displayInfo.cubeFilter = keyCode - 49;
    } else if (keyCode === 88) { // x
        displayInfo.axisFilter = X_AXIS;
    } else if (keyCode === 89) { // y
        displayInfo.axisFilter = Y_AXIS;
    } else if (keyCode === 90) { // z
        displayInfo.axisFilter = Z_AXIS;
    } else if (keyCode === 32) { // SPACE
        displayInfo.reset();
        rubiksCube.resetRotation();
    } else if (keyCode === 38) { // Up
        rubiksCube.rotateCube(createVector(ROTATE_INCREMENT, 0, 0));
    } else if (keyCode === 40) { // Down
        rubiksCube.rotateCube(createVector(-ROTATE_INCREMENT, 0, 0));
    } else if (keyCode === 37) { // Right
        rubiksCube.rotateCube(createVector(0, -ROTATE_INCREMENT, 0));
    } else if (keyCode === 39) { // Left
        rubiksCube.rotateCube(createVector(0, ROTATE_INCREMENT, 0));
    } else if (keyCode === 65) { // a
        displayInfo.decrementSideHighlight();
    } else if (keyCode === 83) { // s
        displayInfo.incrementSideHighlight();
    } else if (keyCode === 81) { // q
        if (displayInfo.sideHighlight > INTERNAL_SIDE) {
            rubiksCube.rotateSide(displayInfo.sideHighlight, 0);
        } else {
            console.log('Please select a side first (a, s)');
        }
    } else if (keyCode === 69) { // e
        if (displayInfo.sideHighlight > INTERNAL_SIDE) {
            rubiksCube.rotateSide(displayInfo.sideHighlight, 1);
        } else {
            console.log('Please select a side first (a, s)');
        }
    }

    console.log('Key', keyCode);
    console.log('Display Info', displayInfo);
  }