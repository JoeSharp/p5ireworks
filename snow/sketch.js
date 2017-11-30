let snow = undefined

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  frameRate(FRAME_RATE)

  snow = new Snow()
}

function draw() {
  background('darkblue') // clear the screen
  snow.run()
}