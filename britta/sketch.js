const WIDTH = 500
const HEIGHT = 500
const BRANCH_INITIAL_LENGTH = 100

let tree;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  tree = new Branch(createVector(WIDTH / 2, HEIGHT), BRANCH_INITIAL_LENGTH, 0)
}

let printed = false

function draw() {
  background('skyblue')
  stroke('black')
  
  if (!printed) {
    console.log('Branches', tree)
  }
  tree.iterateBranches(branch => {
    if (!printed) {
      console.log('fuck yeah', branch)
    }
    line(branch.begin.x, branch.begin.y, branch.end.x, branch.end.y)
  })

  printed = true;
}
