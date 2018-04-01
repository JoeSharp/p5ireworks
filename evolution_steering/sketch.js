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
let checkDebug;

function setup() {
  createCanvas(640, 360);

  checkDebug = createCheckbox('Debug', true);

  for (var i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  for (var i = 0; i < 40; i++) {
    food.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < 20; i++) {
    poison.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(51);

  noStroke();

  if (random(1) < 0.05) {
    food.push(createVector(random(width), random(height)));
  }
  if (random(1) < 0.01) {
    poison.push(createVector(random(width), random(height)));
  }

  // Green Food
  fill(0, 255, 0);
  food.forEach(f => {
    ellipse(f.x, f.y, 4);
  });

  // Red Poison
  fill(255, 0, 0);
  poison.forEach(p => {
    ellipse(p.x, p.y, 4);
  });

  var debug = checkDebug.checked();

  var newVehicles = [];
  vehicles.forEach(v => {
    // Call the appropriate steering behaviors for our agents
    v.behaviours(food, poison);
    v.boundaries();

    //vehicle.seek(target);
    v.update();
    v.display(debug);

    var newVehicle = v.clone();

    if (newVehicle !== null) {
      newVehicles.push(newVehicle);
    }
  });

  newVehicles.forEach(v => vehicles.push(v));

  vehicles.filter(v => v.isDead()).forEach(v => {
    food.push(v.position);
  })
  vehicles = vehicles.filter(v => !v.isDead());
}

function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}