let fireworkId = 0

const FireworkPhase = {
    FUSING: 1,
    ASCENDING : 2,
    EXPLODING : 3
}

const WIDTH = 500
const HEIGHT = 500
const FRAME_RATE = 30
const FRAME_TIME = 1.0 / FRAME_RATE
const GRAVITY = -0.1 // negative pulls downwards

const DEFAULT_FIREWORK_OPTS = {
    speed: 9,
    angle: 2 * Math.PI / 5
}

class Bang {
    constructor(state) {
        this.positionX = state.positionX
        this.positionY = state.positionY
        this.angle = state.angle
        this.speed = 4.0
        this.size = 4
    }

    animate() {
        this.positionX += this.speed * Math.sin(this.angle)
        this.positionY += this.speed * Math.cos(this.angle)
    }

    draw() {
        fill('green');
        ellipse(this.positionX, (HEIGHT - this.positionY), this.size);
    }
}

class Firework {
  constructor(options) {
    this.bangs = []
    this.options = {
      ...DEFAULT_FIREWORK_OPTS,
      ...options
    }
    this.id = fireworkId
    fireworkId += 1
    this.velocity = {
      x: this.options.speed * Math.cos(this.options.angle),
      y: this.options.speed * Math.sin(this.options.angle)
    }

    this.size = 8
    this.fuseTime = Math.random() * 3
    this.flyTime = 3 + (Math.random() * 2)
    this.bangTime = 0.5
    this.timeInPhase = 0.0
    this.phase = FireworkPhase.FUSING
    this.startX = Math.random() * Math.floor(WIDTH / 4)
    this.positionX = this.startX
    this.positionY = 0 
  }

  animate() {
    this.bangs.forEach(b => {
        b.animate()
    })

    this.timeInPhase += FRAME_TIME
    switch (this.phase) {
        case FireworkPhase.FUSING:
            if (this.timeInPhase > this.fuseTime) {
                this.phase = FireworkPhase.ASCENDING
            }
            break
        case FireworkPhase.ASCENDING: 
            this.positionX += this.velocity.x
            this.positionY += this.velocity.y
            if (
                (this.positionY > HEIGHT) ||
                (this.positionY < 0) ||
                (this.timeInPhase > this.flyTime)
                ) {
                this.phase = FireworkPhase.EXPLODING
                this.timeInPhase = 0.0
                for (var x=0; x<6; x++) {
                    this.bangs.push(new Bang({
                        positionX: this.positionX,
                        positionY: this.positionY,
                        angle: x * (2 * Math.PI / 6)
                    }));
                }
            }
            this.velocity.y += GRAVITY
            break;
        case FireworkPhase.EXPLODING:
            if (this.timeInPhase > this.bangTime) {
                this.positionX = this.startX
                this.positionY = 0
                this.velocity = {
                    x: this.options.speed * Math.cos(this.options.angle),
                    y: this.options.speed * Math.sin(this.options.angle)
                }
                this.phase = FireworkPhase.FUSING
                this.bangs = []
            }
            break;
        }
    }

    draw() {
    switch (this.phase) {
        case FireworkPhase.ASCENDING: {
            fill('red');
            ellipse(this.positionX, (HEIGHT - this.positionY), this.size);
            break;
        }
        case FireworkPhase.EXPLODING: {
            break;
        }
        case FireworkPhase.FUSING: {
            break;
        }
    }

    this.bangs.forEach(b => b.draw())
    }
}