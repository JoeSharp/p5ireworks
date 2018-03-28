const RADIUS = 100;
const RESOLUTION = 100;

let cameraX = 0;
let cameraY = 0;

let radiusSlider;
let mSlider, n1Slider, n2Slider, n3Slider;
let mCheckbox, n1Checkbox, n2Checkbox, n3Checkbox;

const DEFAULT_M = 6;
const DEFAULT_N1 = 60;
const DEFAULT_N2 = 55;
const DEFAULT_N3 = 1000;

function setup() {
  createCanvas(500, 500, WEBGL);
  colorMode(HSB)

  createP('Radius')
  radiusSlider = createSlider(1, 200, 100, 1)

  createP('Edit Values')
  createSpan('m')
  mSlider = createSlider(0, 7, DEFAULT_M, 0.1);
  createSpan('n1')
  n1Slider = createSlider(0.1, 1024, DEFAULT_N1, 0.1);
  createSpan('n2')
  n2Slider = createSlider(0.1, 1024, DEFAULT_N2, 0.1);
  createSpan('n3')
  n3Slider = createSlider(0.1, 1024, DEFAULT_N3, 0.1);

  createP('Oscillate Values')
  mCheckbox = createCheckbox('m', false);
  n1Checkbox = createCheckbox('n1', false);
  n2Checkbox = createCheckbox('n2', false);
  n3Checkbox = createCheckbox('n3', false);
}

let cameraPos = 0;
let m = 0;
let animatePhase = 0;
let a = 1;
let b = 1.0;

function supershape(theta, m, n1, n2, n3) {
  let r = 1;

  let t1 = (1 / a) * cos(m * theta / 4)
  t1 = abs(t1)
  t1 = pow(t1, n2)
  
  let t2 = (1 / b) * sin(m * theta / 4)
  t2 = abs(t2)
  t2 = pow(t2, n3)

  return pow((t1 + t2), -1/n1);
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function getSimulationValue(checkbox, slider) {
  if (checkbox.checked()) {
    let min = parseFloat(slider.elt.min);
    let max = parseFloat(slider.elt.max);
    let v = map(sin(animatePhase), 1, -1, min, max)
    v = precisionRound(v,2);
    return v;
  } else {
    return slider.value();
  }
}

function draw() {
  background('black')
  noStroke()
  
  translate(0, 0, -cameraPos)
  rotateX(5 * sin(cameraX))
  rotateY(4 * cos(cameraY))
 
  const sphere = []

  radius = radiusSlider.value()
  m = getSimulationValue(mCheckbox, mSlider);
  n1 = getSimulationValue(n1Checkbox, n1Slider);
  n2 = getSimulationValue(n2Checkbox, n2Slider);
  n3 = getSimulationValue(n3Checkbox, n3Slider);
  //console.log(n2)
  animatePhase += 0.05;

  //console.log('m: ' + m + ', n1: ' + n1 + ', n2: ' + n2 + ', n3: ' + n3)

  // Calculate points
  for (let i=0; i < RESOLUTION+1; i++) {
    const latitude = map(i, 0, RESOLUTION, -HALF_PI, HALF_PI);
    const r2 = supershape(latitude, m, n1, n2, n3)

    const pointsAtLatitude = []
    for (let j=0; j < RESOLUTION+1; j++) {
      const longitude = map(j, 0, RESOLUTION, -PI, PI);
      const r1 = supershape(longitude, m, n1, n2, n3)

      // Sphere
      // const x = RADIUS * sin(latitude) * cos(longitude);
      // const y = RADIUS * sin(latitude) * sin(longitude);
      // const z = RADIUS * cos(latitude);

      const x = radius * r1 * cos(longitude) * r2 * cos(latitude);
      const y = radius * r1 * sin(longitude) * r2 * cos(latitude);
      const z = radius * r2 * sin(latitude);

      // 'Hairy' sphere
      //const rawPoint = createVector(x, y, z);
      //const noiseValue = map(noise(x+(4 * cameraX), y, z), 0, 1, 0, 1)
      //const randomVector = createVector(noiseValue,noiseValue,noiseValue)
      //const point = p5.Vector.mult(rawPoint, noiseValue)
      
      const point = createVector(x, y, z)

      pointsAtLatitude.push({
        longitude,
        point
      })
    }

    sphere.push({
      latitude,
      points: pointsAtLatitude
    })
  }

  for (let i=0; i < RESOLUTION; i++) {
    latitude = sphere[i];
    latitudeP1 = sphere[i + 1];

    let hu = map(i, 0, RESOLUTION, 0, 255 * 1)
    fill(hu % 255, 255, 255)

    beginShape(TRIANGLE_STRIP); 
    for (let j=0; j < RESOLUTION+1; j++) {

      longitude = latitude.points[j];
      longitudeP1 = latitudeP1.points[j];

      vertex(longitude.point.x, longitude.point.y, longitude.point.z);
      vertex(longitudeP1.point.x, longitudeP1.point.y, longitudeP1.point.z);
    }
    endShape(CLOSE);
  }

  cameraX += 0.005;
  cameraY += 0.005;
}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  cameraPos += event.delta;
  //uncomment to block page scrolling
  //return false;
}