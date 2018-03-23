/**
 * This source file contains all the drawing and initialisation code.
 * 
 * It should be considered the 'entry point' of the program.
 * 
 * the p5.js framework will look for specific function names like preload(), setup() and draw()
 * and call them at the appropriate times.
 */

// Keeping it simple with fixed values for the game area
const WIDTH = 500
const HEIGHT = 500

// Useful things to know, the frame time will be used to tune
// the rate at which things change in the frameUpdate() function
const FRAME_RATE = 30
const FRAME_TIME = 1 / FRAME_RATE

// We have to declare the variable here so we can access it in all our functions
// but we won't 'create' it here, that will happen in the setup() function
let car

// Load the car image
// https://p5js.org/reference/#/p5/loadImage
var carImage;
function preload() {
  carImage = loadImage('car.png');
}

// Any p5.js project will almost certainly have the setup function.
// It gets called once at the start of the program
// Here we create the canvas, and the fundamental data for our application (the car)
// The car is given the dimensions of the game area so that it can limit the movement
// within the game area
function setup() {
  createCanvas(WIDTH, HEIGHT);
  car = new Car(createVector(WIDTH / 2, HEIGHT / 2), createVector(WIDTH, HEIGHT))
}

// This function gets called every single frame
function draw() {
  // This has the effect of clearing the screen with the background colour
  // try commenting it out and you will see the car paints itself across
  // the canvas as it moves
  background('skyblue')
  
  // Tell the car to recalculate its position and rotation based on it's current speed etc
  car.frameUpdate(FRAME_TIME)

  // This function saves the state of the matrix translations, we will pop them at the end to reset things
  push()

  // The order of these is very important....
  // They modify the vector maths that is executed when things are drawn
  // This has the effect of putting the car in the right place and rotating it around it's middle, rather than some corner of the screen
  
  // Move all the vector maths to the car's position
  translate(car.position.x, car.position.y)
  
  // Rotate any further drawing by the direction of the car
  rotate(car.direction + PI)

  // Move the car so that it turns around it's middle, rather than around it's corner
  translate(-(car.width / 2), -car.height/2)

  // You can just use a rectangle in place of the image, put this line back in and comment out the 'image()' call
  //rect(0,0, car.width, car.height)

  // We place the image at 0,0, this is done relative to the translations/rotations above, so it should still end up in the right place
  image(carImage, 0,0, car.width, car.height)

  // Restore the original state of the translation matrix
  pop()
}

// This is how you handle key presses in p5.js
function keyPressed() {

  // Notice that I am calling functions on the car, to tell the car what to do
  // But I am not executing any rotations/speed stuff directly.
  // There is also no image/drawing stuff in this code, we are just modifying the car's data
  if (keyCode === UP_ARROW) {
    car.accelerate()
  } else if (keyCode === DOWN_ARROW) {
    car.deccelerate()
  } else if (keyCode === RIGHT_ARROW) {
    car.turnRight()
  } else if (keyCode === LEFT_ARROW) {
    car.turnLeft()
  } 
}