// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Seeking "vehicle" follows the mouse position

// Implements Craig Reynold's autonomous steering behaviors
// One vehicle "seeks"
// See: http://www.red3d.com/cwr/

let vehicles = [];
let food = [];
let poison = [];

function setup() {
  createCanvas(640, 360);

  for (var i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  for (var i = 0; i < 50; i++) {
    food.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < 10; i++) {
    poison.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(51);

  noStroke();

  if (random(1) < 0.05) {
    food.push(createVector(random(width), random(height)));
  }

  // Green Food
  fill(0, 255, 0);
  food.forEach(f => {
    ellipse(f.x, f.y, 8);
  });

  // Red Poison
  fill(255, 0, 0);
  poison.forEach(p => {
    ellipse(p.x, p.y, 8);
  });

  vehicles.forEach(v => {
    // Call the appropriate steering behaviors for our agents
    v.behaviours(food, poison);

    //vehicle.seek(target);
    v.update();
    v.display();
  });

  vehicles = vehicles.filter(v => !v.isDead());
}