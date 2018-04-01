class Particle {
    constructor(x, y, hu, firework) {
        this.position = createVector(x, y);
        this.firework = firework;
        this.lifespan = 255;
        this.hu = hu;
        if (firework) {
            this.velocity = createVector(random(-2, 2), random(-12, -5));
        } else {
            this.velocity = p5.Vector.random2D();
            this.velocity.mult(random(1, 6));
        }
        this.acceleration = createVector(0, 0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    done() {
        return (this.lifespan < 0);
    }

    update() {
        if (!this.firework) {
            this.velocity.mult(0.95);
            this.lifespan -= 4;
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    show() {
        if (!this.firework) {
            stroke(this.hu, 255, 255, this.lifespan);
            strokeWeight(2);
        } else {
            stroke(this.hu, 255, 255);
            strokeWeight(4);
        }
        point(this.position.x, this.position.y);
    }
}

class Firework {
    constructor() {
        this.hu = random(1, 255);
        this.firework = new Particle(random(width), height, this.hu, true);     
        this.exploded = false;   
        this.particles = [];
    }

    update() {
        if (this.exploded) {
            this.particles.forEach(p => {
                p.applyForce(gravity);
                p.update();
            })

            this.particles = this.particles.filter(p => !p.done());
        } else {
            this.firework.applyForce(gravity);
            this.firework.update();

            if (this.firework.velocity.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }
    }

    explode() {
        for (let i=0; i<50; i++) {
            let p = new Particle(this.firework.position.x, this.firework.position.y, this.hu);
            this.particles.push(p);
        }
    }

    done() {
        return this.exploded && (this.particles.length === 0);
    }

    show() {
        if (this.exploded) {
            this.particles.forEach(p => {
                p.show();
            })
        } else {
            this.firework.show();
        }
    }
}