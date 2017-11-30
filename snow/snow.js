const WIDTH = 500
const HEIGHT = 500
const FRAME_RATE = 30
const FRAME_TIME = 1.0 / FRAME_RATE

class SnowFlake {
    constructor(x, y) {
        this.x = x 
        this.y = y
        this.stepLength = 40
        this.numberSteps = 3
        this.numberForks = 5
    }

    run() {
        stroke('white')
        fill('white')
        ellipse(this.x, this.y, 5)

        for (let fork=0; fork<this.numberForks;fork++) {
            let forkAngle = fork * (2 * Math.PI / this.numberForks)
            
            let endX = this.x + (this.stepLength * Math.sin(forkAngle))
            let endY = this.y + (this.stepLength * Math.cos(forkAngle))

            line(this.x, this.y, endX, endY)
        }
    }
}

class Snow {
    constructor() {
        this.snowFlakes = []

        let count = 4
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                let x = (i + 0.5) * WIDTH / count
                let y = (j + 0.5) * WIDTH / count
                this.snowFlakes.push(new SnowFlake(x, y))
            }
        }
    }

    run() {
        this.snowFlakes.forEach(s => s.run())
    }
}