let fireworks = []

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  frameRate(FRAME_RATE)

  for (var x=0; x < 10; x++) {
    fireworks.push(new Firework())
  }
}

function draw() {
  background('black') // clear the screen
  
  // Send animate calls to everything
  fireworks.forEach(f => {
    f.animate()
    f.draw()
  })
}