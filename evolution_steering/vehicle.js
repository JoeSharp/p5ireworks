// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

const GOOD = 0;
const BAD = 0;

class Vehicle {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.health = 1;

        this.dna = [];
        this.dna[GOOD] = random(-5, 5);
        this.dna[BAD] = random(-5, 5);
    }

    // Method to update location
    update() {
        this.health -= 0.005;

        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    // Weighting the steering behaviours
    behaviours(good, bad) {
        var steerG = this.eat(good, 0.3);
        var steerB = this.eat(bad, -0.1);

        steerG.mult(this.dna[GOOD]);
        steerB.mult(this.dna[BAD]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    eat(list, nutrition) {
        var record = Infinity;
        var closest = -1;
        list.forEach((l, i) => {
            var d = dist(this.position.x, this.position.y, l.x, l.y);
            if (d < record) {
                record = d;
                closest = i;
            }
        })

        // This is the moment of eating!
        if (record < 5) {
            list.splice(closest, 1);
            this.health += nutrition;
        } else if (closest > -1) {
            return this.seek(list[closest]);
        }

        return createVector();
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        return steer;
    }

    isDead() {
        return (this.health < 0);
    }

    display() {
        // Draw a triangle rotated in the direction of velocity
        var theta = this.velocity.heading() + PI / 2;
        fill(127);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);

        stroke(0, 255, 0);
        line(0, 0, 0, -this.dna[0] * 20);
        stroke(255, 0, 0);
        line(0, 0, 0, -this.dna[1] * 20);

        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);

        stroke(col)
        fill(col)
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }
}