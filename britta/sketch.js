const WIDTH = 500
const HEIGHT = 500
const BRANCH_INITIAL_LENGTH = 100
const BRANCH_INITIAL_THICKNESS = 30
const BRANCH_DEPTH = 10
const GROWTH_RATE = 1.5;
const FRAME_RATE = 30
const FRAME_TIME = 1 / FRAME_RATE
const TEXT_SIZE = 32
const TEXT_FONT = 'Helvetica'

let tree;
let frameTime = 0;
let colours;
let colourIndex = 0;

let rootColour;
let twigColour;
let branchColours = []

function setup() {
  createCanvas(WIDTH, HEIGHT);
  rootColour = color(random(255), random(255), random(255))
  twigColour = color(random(255), random(255), random(255))

  for (let x=0; x<BRANCH_DEPTH; x++) {
    branchColours.push(lerpColor(twigColour, rootColour, x / BRANCH_DEPTH))
  }

  tree = rootBranch(createVector(WIDTH / 2, HEIGHT), BRANCH_DEPTH)
    .withLength(BRANCH_INITIAL_LENGTH)
    .withDirection(0)
    .withThickness(BRANCH_INITIAL_THICKNESS)
    .build()
    
  textSize(TEXT_SIZE)
  textFont(TEXT_FONT);
}

let printed = false

function draw() {
  background('skyblue')
  
  colourIndex = 0;

  // Calculate a value of noise to use for the 'wind'
  const jitter = map(noise(frameTime/3), 0, 1, -PI/2, PI/2)
  
  // Apply jitter to all branch directions, also handle growth
  tree.iterateBranches(branch => {
    // Apply the effect of the wind
    branch.direction = branch.originalDirection + (jitter / branch.thickness)

    // Grow the branch if it has yet to reach it's intended length
    if (branch.length < branch.intendedLength) {
      branch.length += GROWTH_RATE
    } 

    // Set the colour and thickness of the branch
    stroke(branchColours[branch.depth])
    strokeWeight(branch.thickness)

    // Draw the branch
    line(branch.parentBranch.end.x,
       branch.parentBranch.end.y, 
       branch.end.x, 
       branch.end.y)

    // This function should return a boolean to indicate if the iterator should go to children
    return (branch.length >= branch.intendedLength)
  })

  frameTime += FRAME_TIME
  
  strokeWeight(1)
  text('Thank you Britta!', 10, TEXT_SIZE)
  text('Love from Tom and the Sharps x', 10, 2.5 * TEXT_SIZE)
}

function resetTree() {
  rootColour = color(random(255), random(255), random(255))
  twigColour = color(random(255), random(255), random(255))

  branchColours = []
  for (let x=0; x<BRANCH_DEPTH; x++) {
    branchColours.push(lerpColor(twigColour, rootColour, x / BRANCH_DEPTH))
  }

  tree.resetGrowth();
}

function mousePressed() {
  resetTree()

  // prevent default
  return false;
}

function touchStarted() {
  resetTree()

  // prevent default
  return false;
}