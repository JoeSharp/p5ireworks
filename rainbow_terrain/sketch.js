let cols, rows;
let scale = 5;
let w = 1000;
let h = 1000;
var fr = 30; //starting FPS
let noiseScale = 0.05;
let flying = 0;

let hueValue = 0
let colours
let colourSpeed = 10

let terrain = []

function setup() {
  createCanvas(w, h, WEBGL);
  cols = w / scale;
  rows = h / scale;
  frameRate(fr); // Attempt to refresh at starting FPS

  colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].map(x => color(x))
}

function draw() {
  background('skyblue')
  stroke('black')
  noStroke()
  noFill()
  rotateX(PI / 3)
  flying -= 0.05

  let xOff = 0;
  for (let x=0; x < cols; x++) {
    let yOff = flying;
    terrain[x] = []
    for (let y=0; y < rows; y++) {
      terrain[x][y] = map(noise(xOff, yOff), 0, 1, -50, 100)
      yOff += noiseScale
    }
    xOff += noiseScale
  }
  let colourIndex = 0
  let colourSpeedIndex = 0
  translate(-w/2, -h/2)
  for (let y=0; y < rows-1; y++) {
    beginShape(TRIANGLE_STRIP);

    let from = colours[colourIndex]
    let to = colours[(colourIndex + 1) % colours.length]
    fill(lerpColor(from, to, colourSpeedIndex / colourSpeed))

    if (colourSpeedIndex > colourSpeed) {
      colourIndex += 1
      colourIndex %= colours.length
      colourSpeedIndex = 0
    } else {
      colourSpeedIndex += 1
    }
    for (let x=0; x < cols; x++) {
      vertex(x * scale, y * scale, terrain[x][y]);
      vertex(x * scale, (y+1) * scale, terrain[x][y+1]);
    }
    endShape();
  }
}