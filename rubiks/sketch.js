let rubiksCube;
let axisFilter = -1;
let cubeFilter = -1;
let time = 0.5;
const TIME_SPEED = 0.02;
let xRotate = 0;
let yRotate = 0;
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

    rubiksCube.cubelets.forEach(c => console.log('Cubelet', c))

    COLOURS[INTERNAL_SIDE] = color('black');

    let colourValues = ['white', 'yellow', 'green', 'blue', 'orange', 'red'];
    let colourIndex = 0;
    SIDES.forEach((s, si) => {
        COLOURS[si] = colourValues[colourIndex++];
    });
}

function draw() {
    background(51);

    rotateX(xRotate);
    rotateY(yRotate);
    //rotateZ(time);
    time += TIME_SPEED;

    rubiksCube.cubelets
        .forEach((c, ci) => {
            push();

            translate(c.x * BLOCK_SIZE, c.y * BLOCK_SIZE, c.z * BLOCK_SIZE);

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
    } else if (keyCode === 38) { // Up
        xRotate += ROTATE_INCREMENT;
    } else if (keyCode === 40) { // Down
        xRotate -= ROTATE_INCREMENT;
    } else if (keyCode === 37) { // Right
        yRotate -= ROTATE_INCREMENT;
    } else if (keyCode === 39) { // Left
        yRotate += ROTATE_INCREMENT;
    }
  }