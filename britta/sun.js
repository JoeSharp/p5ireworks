class Sun {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.centreX = width/2;
        this.centreY = height;
        this.radius = width / 4;
        this.rotationRadius = height * 0.7;
        this.phase = PI / 4;
    }

    animateFrame() {
        this.phase += 0.01;

        let vector = createVector(0, this.rotationRadius)
        vector.rotate(this.phase)

        this.x = vector.x;
        this.y = vector.y;

        if ((this.x > -(this.width/2)) && (this.x < (this.width/2)) && (this.y < 0)) {
            this.dayTime = true;
        } else {
            this.dayTime = false;
        }
    }
}