
class Cloud {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.radius = map(random(), 0, 1, 50, 120)
        this.y = map(random(), 0, 1, height*0.2, height*0.3);
        this.positionPhase = map(random(), 0, 1, 0, PI);
        this.colourPhase = map(random(), 0, 1, 0, PI);
    }

    animateFrame() {
        this.x = this.width * sin(this.positionPhase)
        this.positionPhase += 0.0005
        this.colourPhase += 0.001;
    }
}