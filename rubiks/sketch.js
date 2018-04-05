let rubiksCube;

let displayInfo = {
    axisFilter : -1,
    cubeFilter : -1,
    sideFilter : INTERNAL_SIDE,

    reset() {
        this.axisFilter = -1;
        this.cubeFilter = -1;
        this.sideFilter = INTERNAL_SIDE;
    },

    incrementsideFilter() {
        this.sideFilter++;
        this.sideFilter %= SIDES.length;
    },

    decrementsideFilter() {
        this.sideFilter--;
        if (this.sideFilter < 0) {
            this.sideFilter = SIDES.length-1;
        }
    }, 
    
    checkCubeFilter(c, ci) {
        return ((this.cubeFilter === -1) || ((ci % 9) === this.cubeFilter));
    },

    checkSideFilter(c, ci) {
        if (this.sideFilter > INTERNAL_SIDE) {
            return rubiksCube.sides[this.sideFilter].filter(sc => {
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

const HALF_BLOCK_SIZE = 20;
const BLOCK_SIZE_X_5 = HALF_BLOCK_SIZE * 10;

function setup() {
    createCanvas(400, 400, WEBGL);
    colorMode(RGB);

    strokeWeight(4);

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

    if (displayInfo.sideFilter > INTERNAL_SIDE) {
        stroke('pink');
        let v = getUnitVector(SIDES[displayInfo.sideFilter].axis);
        line(0, 0, 0, v.x * BLOCK_SIZE_X_5, v.y * BLOCK_SIZE_X_5, v.z * BLOCK_SIZE_X_5);
    }

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
                c.position.x * HALF_BLOCK_SIZE * 2, 
                c.position.y * HALF_BLOCK_SIZE * 2, 
                c.position.z * HALF_BLOCK_SIZE * 2
            );

            c.sidePanels.forEach((s, si) => {
                beginShape();

                if (displayInfo.checkCubeFilter(c, ci)) {
                    fill(COLOURS[s.side]);
                } else {
                    noFill();
                }

                s.vertices.forEach((v, vi) => {
                    vertex(v.x * HALF_BLOCK_SIZE, v.y * HALF_BLOCK_SIZE, v.z * HALF_BLOCK_SIZE);
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
        displayInfo.decrementsideFilter();
    } else if (keyCode === 83) { // s
        displayInfo.incrementsideFilter();
    } else if (keyCode === 81) { // q
        if (displayInfo.sideFilter > INTERNAL_SIDE) {
            rubiksCube.rotateSide(displayInfo.sideFilter, 0);
        } else {
            console.log('Please select a side first (a, s)');
        }
    } else if (keyCode === 69) { // e
        if (displayInfo.sideFilter > INTERNAL_SIDE) {
            rubiksCube.rotateSide(displayInfo.sideFilter, 1);
        } else {
            console.log('Please select a side first (a, s)');
        }
    }

    //console.log('Key', keyCode);
    //console.log('Display Info', displayInfo);
  }