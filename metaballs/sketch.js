
const NUMBER_OF_BALLS = 3;

let metaballs = []
let pd

let maxHu = 0

const colours = {

}

function setup() {
  createCanvas(300, 300);
  colorMode(HSB);

  for (i=0; i<NUMBER_OF_BALLS; i++) {
    metaballs.push(new Metaball());
  }

  pd = pixelDensity();

  for (let i=0; i<=255; i++) {
    var colour = color('hsb(' + (255-i) + ', 100%, 100%)');
    colours[i] = {
      r : red(colour),
      g : green(colour),
      b : blue(colour)
    };
  }
}

function setPixel(x, y, hu) {
  if (hu > maxHu) {
    maxHu = hu;
  }
  for (var i = 0; i < pd; i++) {
    for (var j = 0; j < pd; j++) {
      // loop over
      idx = 4 * ((y * pd + j) * width * pd + (x * pd + i));
      pixels[idx] = colours[hu].r;
      pixels[idx+1] = colours[hu].g;
      pixels[idx+2] = colours[hu].b;
      //pixels[idx+3] = a;
    }
  }
}

function draw() {
  background('black')
  stroke('white')
  noFill()

  // Update the state of the balls
  metaballs.forEach(m => {
    m.update();

    //ellipse(m.pos.x, m.pos.y, m.radius);
  });

  //console.log('Pixel Density', pd)

  loadPixels();

  for (var x=0; x<width; x++) {
    for (var y=0; y<height; y++) {
      var index = (x + y * width) * 4;
      let sum = 0.0;
      metaballs.forEach(m => {
        let distance = dist(x, y, m.pos.x, m.pos.y);
        sum += 200 * m.radius / distance;
      })

      sum = map(sum, 0, width * metaballs.length, 0, 255)
      sum = constrain(sum, 0, 255);
      sum = Math.floor(sum);

      setPixel(x, y, sum);
    }
  }

  updatePixels();

  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  var fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  text('MaxHu: ' + maxHu, 10, height - 30);
}