const RADIUS = 100;
const RESOLUTION = 100;

let cameraX = 0;
let cameraY = 0;

let configCapture;

const DEFAULT_RADIUS = 100;
const DEFAULT_M = 7;
const DEFAULT_N1 = 0.2;
const DEFAULT_N2 = 1.7;
const DEFAULT_N3 = 1.7;

class FloatCapture {
  constructor(name, defaultValue) {
    this.label = createSpan(name)
    this.input = createInput(defaultValue, 'number');
    this.value = defaultValue;
    this.input.input(() => {
      this.value = parseFloat(this.input.value());
    });
  }

  getValue() {
    return this.value;
  }
}

class ValueCapture {
  constructor(name, defaultValue) {
    this.name = name;

    this.value = defaultValue;
    this.label = createP(name)
    this.fixedCapture = new FloatCapture('Fixed', defaultValue);
    this.minCapture = new FloatCapture('Min', defaultValue);
    this.maxCapture = new FloatCapture('Max', defaultValue);

    this.oscillateCheckbox = createCheckbox(name, false);
  }

  getValue() {
    return this.value;
  }

  animate(time) {
    if (this.oscillateCheckbox.checked()) {
      this.value = map(sin(time), 0, 1, this.minCapture.getValue(), this.maxCapture.getValue());
    } else {
      this.value = parseFloat(this.fixedCapture.getValue());
    }
  }
}

class ShapeConfigCapture {
  constructor(name) {
    this.label = createP(name)
    this.m = new ValueCapture('m', DEFAULT_M)
    this.n1 = new ValueCapture('n1', DEFAULT_N1)
    this.n2 = new ValueCapture('n2', DEFAULT_N2)
    this.n3 = new ValueCapture('n3', DEFAULT_N3)
  }

  getConfig() {
    return {
      a: 1,
      b: 1,
      m: this.m.getValue(),
      n1: this.n1.getValue(),
      n2: this.n2.getValue(),
      n3: this.n3.getValue(),
    }
  }

  animate(time) {
    this.m.animate(time);
    this.n1.animate(time);
    this.n2.animate(time);
    this.n3.animate(time);
  }
}

class MutliShapeConfigCapture {
  constructor() {
    this.radius = new ValueCapture('radius', DEFAULT_RADIUS)
    this.r1 = new ShapeConfigCapture('Shape R1');
    this.r2 = new ShapeConfigCapture('Shape R2');
  }

  getConfig() {
    return {
      r1: this.r1.getConfig(),
      r2: this.r2.getConfig(),
      radius: this.radius.getValue()
    }
  }

  animate(time) {
    this.radius.animate(time);
    this.r1.animate(time);
    this.r2.animate(time);
  }
}

function setup() {
  createCanvas(500, 500, WEBGL);
  colorMode(HSB)

  configCapture = new MutliShapeConfigCapture();
}

let cameraPos = 0;
let animatePhase = 0;

function supershape(theta, config) {
  let t1 = (1 / config.a) * cos(config.m * theta / 4)
  t1 = abs(t1)
  t1 = pow(t1, config.n2)
  
  let t2 = (1 / config.b) * sin(config.m * theta / 4)
  t2 = abs(t2)
  t2 = pow(t2, config.n3)

  return pow((t1 + t2), -1/config.n1);
}

function draw() {
  background('black')
  noStroke()
  
  translate(0, 0, -cameraPos)
  rotateX(5 * sin(cameraX))
  rotateY(4 * cos(cameraY))
 
  const sphere = []

  let config = configCapture.getConfig()
  configCapture.animate(animatePhase);
  animatePhase += 0.05;

  // Calculate points
  for (let i=0; i < RESOLUTION+1; i++) {
    const latitude = map(i, 0, RESOLUTION, -HALF_PI, HALF_PI);
    const r2 = supershape(latitude, config.r2)

    const pointsAtLatitude = []
    for (let j=0; j < RESOLUTION+1; j++) {
      const longitude = map(j, 0, RESOLUTION, -PI, PI);
      const r1 = supershape(longitude, config.r1)

      // Sphere
      // const x = RADIUS * sin(latitude) * cos(longitude);
      // const y = RADIUS * sin(latitude) * sin(longitude);
      // const z = RADIUS * cos(latitude);

      const x = config.radius * r1 * cos(longitude) * r2 * cos(latitude);
      const y = config.radius * r1 * sin(longitude) * r2 * cos(latitude);
      const z = config.radius * r2 * sin(latitude);

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
  //cameraPos += event.delta;
  //uncomment to block page scrolling
  //return false;
}