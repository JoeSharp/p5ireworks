class SunAndMoon {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.centreX = width/2;
        this.centreY = height;
        this.radius = width / 8;
        this.rotationRadius = width * 0.5;
        this.phase = 0;
        this.frequency = 0.4;
    }

    animateFrame(time) {
        this.phase = this.frequency * time;

        let sunVector = createVector(this.rotationRadius, 0)

        sunVector.rotate(this.phase)

        this.sun = sunVector;
        this.moon = sunVector.copy().rotate(PI);

        if (this.sun.heading() < 0) {
            this.dayTime = true;
        } else {
            this.dayTime = false;
        }
    }
}