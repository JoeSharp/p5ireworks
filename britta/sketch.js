const WIDTH = 500
const HEIGHT = 500
const BRANCH_INITIAL_LENGTH = 100
const BRANCH_INITIAL_THICKNESS = 30
const FRAME_RATE = 30
const FRAME_TIME = 1 / FRAME_RATE

let tree;
let frameTime = 0

function setup() {
  createCanvas(WIDTH, HEIGHT);
  tree = branchAt(createVector(WIDTH / 2, HEIGHT))
    .withLength(BRANCH_INITIAL_LENGTH)
    .withDirection(0)
    .withThickness(BRANCH_INITIAL_THICKNESS)
    .build()
}

let printed = false

function draw() {
  background('skyblue')
  stroke('darkgreen')
  
  tree.iterateBranches(branch => {
    const jitter = 0;// map(noise(frameTime), 0, 1, -50, 50)
    strokeWeight(branch.thickness)
    line(branch.begin.x + jitter, branch.begin.y, branch.end.x, branch.end.y)
  })

  frameTime += FRAME_TIME
  printed = true;
}
