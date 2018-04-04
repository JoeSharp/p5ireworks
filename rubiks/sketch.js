let rubiksCube;
let axisFilter = -1;
let cubeFilter = -1;
let time = 0.5;
const TIME_SPEED = 0.02;

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
    COLOURS[LEFT_SIDE] = color('white');
    COLOURS[RIGHT_SIDE] = color('yellow');
    COLOURS[TOP_SIDE] = color('green');
    COLOURS[BOTTOM_SIDE] = color('blue');
    COLOURS[NEAR_SIDE] = color('orange');
    COLOURS[FAR_SIDE] = color('red');
}

function draw() {
    background(51);

    rotateX(time);
    rotateY(time);
    rotateZ(time);
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
    }
  }