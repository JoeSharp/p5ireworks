// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

const GOOD_ATTRACTION = 0;
const BAD_ATTRACTION = 1;
const GOOD_PERCEPTION = 2;
const BAD_PERCEPTION = 3;
const MUTATION_RATE = 0.1;

function adjustDna(thisDna, parentDna, index, range) {
    thisDna[index] = parentDna[index];
    if (random(1) < MUTATION_RATE) {
        thisDna[index] += random(-range, range);
    }
}

class Vehicle {
    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.health = 1;

        this.dna = [];

        if (dna === undefined) {
            this.dna[GOOD_ATTRACTION] = random(-2, 2);
            this.dna[BAD_ATTRACTION] = random(-2, 2);
            this.dna[GOOD_PERCEPTION] = random(0, 100);
            this.dna[BAD_PERCEPTION] = random(0, 100);
        } else {
            adjustDna(this.dna, dna, GOOD_ATTRACTION, 0.1);
            adjustDna(this.dna, dna, BAD_ATTRACTION, 0.1);
            adjustDna(this.dna, dna, GOOD_PERCEPTION, 10);
            adjustDna(this.dna, dna, BAD_PERCEPTION, 10);
        }
    }

    // Method to update location
    update() {
        // Reduce the health (hunger)
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
        this.eat(good, 0.3);
        this.eat(bad, -0.75);
        var steerG = this.seekList(good, this.dna[GOOD_PERCEPTION]);
        var steerB = this.seekList(bad, this.dna[BAD_PERCEPTION]);

        steerG.mult(this.dna[GOOD_ATTRACTION]);
        steerB.mult(this.dna[BAD_ATTRACTION]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    seekList(list, perception) {
        var record = Infinity;
        var closest = null;
        list.forEach((l, i) => {
            var d = dist(this.position.x, this.position.y, l.x, l.y);
            if ((d < record) && (d < perception)) {
                record = d;
                closest = l;
            }
        })

        if (closest !== null) {
            return this.seek(closest);
        }

        return createVector();
    }

    eat(list, nutrition) {
        var eaten = [];
        list.forEach((l, i) => {
            var d = dist(this.position.x, this.position.y, l.x, l.y);
            if (d < this.maxspeed) {
                eaten.push(i);
                this.health += nutrition;
            }
        })

        // This is the moment of eating!
        eaten.forEach(i => list.splice(i, 1));
    }

    clone() {
        if (random(1) < 0.001) {
            return new Vehicle(this.position.x+10, this.position.y+10, this.dna);
        } else {
            return null;
        }
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

    boundaries() {
        var desired = null;
        var d = 25;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    isDead() {
        return (this.health < 0);
    }

    display(includeDebug) {
        // Draw a triangle rotated in the direction of velocity
        var theta = this.velocity.heading() + PI / 2;
        fill(127);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);

        // Fill in health
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

        if (includeDebug) {
            // Draw debug information
            noFill();
            strokeWeight(4)
            stroke(0, 255, 0);
            line(0, 0, 0, -this.dna[GOOD_ATTRACTION] * 20);
            ellipse(0, 0, this.dna[GOOD_PERCEPTION] * 2);
            
            strokeWeight(2)
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[BAD_ATTRACTION] * 20);
            ellipse(0, 0, this.dna[BAD_PERCEPTION] * 2);
        }

        pop();
    }
}