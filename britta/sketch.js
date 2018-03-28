
const BRANCH_INITIAL_LENGTH = 90
const BRANCH_INITIAL_THICKNESS = 50
const BRANCH_DEPTH = 10
const GROWTH_RATE = 1.5;
const GRASS_HEIGHT = 60;
const FRAME_RATE = 30
const FRAME_TIME = 1 / FRAME_RATE
const TEXT_SIZE = 32
const TEXT_FONT = 'Helvetica'
const NUMBER_CLOUDS = 3;

let sun;
let clouds = []
let tree;
let frameTime = 0;
let colours;
let colourIndex = 0;

let rootColour;
let twigColour;
let branchColours = []

function setup() {
  createCanvas(500, 500);

  sun = new Sun(width, height);

  for (let i=0; i<NUMBER_CLOUDS; i++) {
    let cloud = new Cloud(width, height)
    clouds.push(cloud);
  }

  tree = rootBranch(createVector(width / 2, height), BRANCH_DEPTH)
    .withLength(BRANCH_INITIAL_LENGTH)
    .withDirection(0)
    .withThickness(BRANCH_INITIAL_THICKNESS)
    .build()
    
  textSize(TEXT_SIZE)
  textFont(TEXT_FONT);
  
  resetTree();
}

let printed = false

function draw() {

  
  
  // Draw Sun
  push()
  translate(width/2, height)
  sun.animateFrame();

  if (sun.dayTime) {
    background('skyblue')
  } else {
    background('black')
  }

  fill('goldenrod')
  ellipse(sun.x, sun.y, sun.radius)
  pop()

  // Draw grass
  fill('darkgreen');
  noStroke();
  rect(0, height-GRASS_HEIGHT, width, height)

  // Draw Clouds
  clouds.forEach(c => {
    c.animateFrame();
    
    let alpha = map(sin(c.colourPhase), 0, 1, 150, 200)
    //console.log('alpha', alpha)
    fill(40, 40, 40, 80)
    ellipse(c.x, c.y, c.radius)
    ellipse(c.x-(c.radius*1.3), c.y+(c.radius*0.3), c.radius*0.7)
    ellipse(c.x+(c.radius*0.8), c.y+(c.radius*0.3), c.radius*0.8)
  })

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
  stroke('black')
  fill('darkgreen')
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