// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Seeking "vehicle" follows the mouse position

// Implements Craig Reynold's autonomous steering behaviors
// One vehicle "seeks"
// See: http://www.red3d.com/cwr/

let vehicle;
let food = [];
let poison = [];

function setup() {
  createCanvas(640, 360);
  vehicle = new Vehicle(width / 2, height / 2);

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  noStroke();

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

  // Call the appropriate steering behaviors for our agents
  vehicle.eat(food);
  vehicle.eat(poison);
  //vehicle.seek(target);
  vehicle.update();
  vehicle.display();

}