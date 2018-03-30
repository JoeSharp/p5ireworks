class Metaball {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.radius = random(width/10, width/3);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(5);
    }

    update() {
        this.pos.add(this.velocity);

        if ((this.pos.x > width) || (this.pos.x < 0)) {
            this.velocity.x *= -1;
        }

        if ((this.pos.y > height) || (this.pos.y < 0)) {
            this.velocity.y *= -1;
        }
    }
}