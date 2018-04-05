let rubiksCube;
let axisFilter = -1;
let cubeFilter = -1;
let time = 0.5;
const TIME_SPEED = 0.02;
const ROTATE_INCREMENT = Math.PI / 6;

const COLOURS = {};

let checkCubeFilter = (c, ci) => ((cubeFilter === -1) || ((ci % 9) === cubeFilter))

const BLOCK_SIZE = 50;

function setup() {
    createCanvas(400, 400, WEBGL);
    colorMode(RGB);

    stroke('black')
    strokeWeight(8);

    rubiksCube = new RubiksCube();
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

    rotateX(rubiksCube.rotation.x);
    rotateY(rubiksCube.rotation.y);
    rotateZ(rubiksCube.rotation.z);
    time += TIME_SPEED;

    rubiksCube.cubelets
        .forEach((c, ci) => {
            push();

            translate(
                c.position.x * BLOCK_SIZE, 
                c.position.y * BLOCK_SIZE, 
                c.position.z * BLOCK_SIZE
            );

            c.sides.forEach((s, si) => {
                beginShape();

                if (checkCubeFilter(c, ci)) {
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
    //console.log('Key', keyCode);

    if ((keyCode >= 49) && (keyCode <= 57)) { // 1-9
        cubeFilter = keyCode - 49;
    } else if (keyCode === 88) { // x
        axisFilter = X_AXIS;
    } else if (keyCode === 89) { // x
        axisFilter = Y_AXIS;
    } else if (keyCode === 90) { // x
        axisFilter = Z_AXIS;
    } else if (keyCode === 32) { // SPACE
        cubeFilter = -1;
        axisFilter = -1;
        xRotate = ROTATE_INCREMENT;
        yRotate = ROTATE_INCREMENT;
    } else if (keyCode === 38) { // Up
        rubiksCube.rotateCube(createVector(ROTATE_INCREMENT, 0, 0));
    } else if (keyCode === 40) { // Down
        rubiksCube.rotateCube(createVector(-ROTATE_INCREMENT, 0, 0));
    } else if (keyCode === 37) { // Right
        rubiksCube.rotateCube(createVector(0, -ROTATE_INCREMENT, 0));
    } else if (keyCode === 39) { // Left
        rubiksCube.rotateCube(createVector(0, ROTATE_INCREMENT, 0));
    }
  }