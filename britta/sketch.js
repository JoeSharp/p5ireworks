const WIDTH = 500
const HEIGHT = 500
const BRANCH_INITIAL_LENGTH = 100
const BRANCH_INITIAL_THICKNESS = 30
const FRAME_RATE = 30
const FRAME_TIME = 1 / FRAME_RATE

let tree;
let frameTime = 0;
let colours;
let colourIndex = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  tree = rootBranch(createVector(WIDTH / 2, HEIGHT))
    .withLength(BRANCH_INITIAL_LENGTH)
    .withDirection(0)
    .withThickness(BRANCH_INITIAL_THICKNESS)
    .build()

  colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].map(x => color(x))
}

let printed = false

function draw() {
  background('skyblue')
  stroke('darkgreen')
  
  colourIndex = 0;

  // Apply jitter to all branch directions
  tree.iterateBranches(branch => {
    const jitter = map(noise(frameTime), 0, 1, -PI/2, PI/2)
    branch.direction = branch.originalDirection + (jitter / branch.thickness)
  })

  tree.iterateBranches(branch => {
    //stroke(colours[colourIndex])
    //colourIndex += 1
    //colourIndex %= colours.length

    strokeWeight(branch.thickness)
    line(branch.parentBranch.end.x,
       branch.parentBranch.end.y, 
       branch.end.x, 
       branch.end.y)
  })

  frameTime += FRAME_TIME
  printed = true;
}

function mousePressed() {
  tree.resetGrowth();
  // prevent default
  return false;
}

function touchStarted() {
  tree.resetGrowth();
  // prevent default
  return false;
}