/**
 * This code contains the 'model' for our game.
 * There is no drawing code in this, although it does use the p5 Vector class.
 * 
 * The 'car' defines the concept of a top-down driving controlled sprite.
 * It has a start position, and then it has things like speed and direction.
 * 
 * When keys are pressed, the events like 'turnLeft(), accelerate() etc are called'
 * These modify the speed and direction.
 * 
 * frameUpdate() is called every frame and is used to recalculate the position of the car based
 * on it's current speed etc.
 */

class Car {
    constructor(startPosition, playArea) {
        this.position = startPosition
        this.playArea = playArea

        this.width = 20
        this.height = 40

        this.direction = 0
        this.speed = 0
        this.acceleration = 0.5
        this.decceleration = 2.0
        this.turnSpeed = PI / 8
    }

    /**
     * Pressing the 'turn right' key is coded to call this
     */
    turnRight() {
        this.direction += this.turnSpeed
    }

    /**
     * Pressing the 'turn left' key is coded to call this
     */
    turnLeft() {
        this.direction -= this.turnSpeed
    }

    /**
     * Pressing the 'accelerate' key is coded to call this
     */
    accelerate() {
        this.speed += this.acceleration;
    }

    /**
     * Pressing the 'deccelerate' key is coded to call this
     */
    deccelerate() {
        this.speed -= this.decceleration;

        // Cap the speed to zero
        if (this.speed < 0) {
            this.speed = 0
        }
    }

    /**
     * This is called for every animation frame, we use it to calculate the new
     * values of position at the given time, based on the various properties of the car.
     * 
     * @param {*} frameTime The amount of time that has elapsed since the last frame 
     */
    frameUpdate(frameTime) {
        let adjust = createVector(0, 1)
        adjust.rotate(this.direction)
        adjust.mult(this.speed)

        this.position.add(adjust)

        // Make sure we don't go off the screen
        this.position.x = min(this.position.x, this.playArea.x)
        this.position.x = max(this.position.x, 0)
        this.position.y = min(this.position.y, this.playArea.y)
        this.position.y = max(this.position.y, 0)
    }
}