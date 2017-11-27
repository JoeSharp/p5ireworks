let rain = []

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  frameRate(FRAME_RATE)

  rain = new Rain()
  BAUBLE_DATA.kate.forEach(b => rain.addBauble(new Bauble(b.x, b.y)))
}

function draw() {
  background('cyan') // clear the screen
  rain.run()
}

// Add a new bauble into the System
let lastBaubleX = 0
let lastBaubleY = 0
const MIN_BAUBLE_DISTANCE = 10.0

function touchStarted() {
  if (!!touches && (touches.length == 3)) {
    rain.clearBaubles()
  }
}
function keyPressed() {
  if (keyCode === RETURN) {
    rain.clearBaubles()
  } 
}

function touchMoved() {
    var a = lastBaubleX - mouseX
    var b = lastBaubleY - mouseY
    
    var c = Math.sqrt( a*a + b*b );
    if (c > MIN_BAUBLE_DISTANCE) {
        rain.addBauble(new Bauble(mouseX,mouseY));
        lastBaubleX = mouseX
        lastBaubleY = mouseY
    }
}