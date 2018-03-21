const WIDTH = 1000
const HEIGHT = 500
const FRAME_RATE = 30
const FRAME_TIME = 1.0 / FRAME_RATE
const TEXT_SIZE = 32
let colours
let rainbowBoard;
let scaleX
let scaleY

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(FRAME_RATE); // Attempt to refresh at starting FPS

  colours = ['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].map(x => color(x))

  rainbowBoard = new RainbowBoard(colours.length);

  scaleX = WIDTH / rainbowBoard.cols
  scaleY = HEIGHT / rainbowBoard.rows

  textSize(TEXT_SIZE)
  textFont('Georgia');
}

function draw() {
  background('skyblue')
  stroke('grey')
  
  rainbowBoard.animate(FRAME_TIME);

  rainbowBoard.tiles
    .filter(tile => tile.state > 0)
    .forEach(tile => {
      fill(colours[tile.state])
      rect(tile.x * scaleX, tile.y * scaleY, scaleX, scaleY)
    })

  text('Happy Birthday Kate!', 10, HEIGHT - (3 * TEXT_SIZE))
  text('Lots of Love, Joe, Tom and Indigo xxxx', 10, HEIGHT - TEXT_SIZE)
}

function mousePressed() {
  rainbowBoard.addWave(mouseX / scaleX, mouseY / scaleY)
  // prevent default
  return false;
}

function touchStarted() {
  waveX = Math.floor(mouseX / scaleX)
  waveY = Math.floor(mouseY / scaleY)
  rainbowBoard.addWave(waveX, waveY)
  // prevent default
  return false;
}