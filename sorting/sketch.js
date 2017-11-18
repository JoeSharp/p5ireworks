let timedBars

const WIDTH = 500
const HEIGHT = 500
const FRAME_RATE = 60
const MARGIN = 20
const BAR_WIDTH = 20
const DATA_LENGTH = WIDTH / (BAR_WIDTH)

function setup() {
    createCanvas(WIDTH, HEIGHT);
    noStroke();
    frameRate(FRAME_RATE)

    timedBars = new TimedBars();
}

function draw() {
    background('white')
    timedBars.draw()
}

function keyPressed() {
    switch (keyCode) {
        case 32: // space
        new BubbleSort().run(timedBars.initialData, timedBars.update.bind(timedBars))
        break
    }
}

class TimedBars {
    constructor() {
        this.dataHistory = []

        this.initialData = []
        for (let x=0; x < DATA_LENGTH; x++) {
            this.initialData.push(Math.random() * HEIGHT)
        }
        this.update(this.initialData)
    }

    draw() {
        fill('green')

        if (this.dataHistory.length > 0) {
            this.dataHistory[0].forEach((x, i) => {
                rect((i * BAR_WIDTH), HEIGHT - x, BAR_WIDTH, x, BAR_WIDTH/2, BAR_WIDTH/2, 0, 0)  
            })

            if (this.dataHistory.length > 1) {
                this.dataHistory.splice(0, 1)
            }
        }
    }

    update(data) {
        this.dataHistory.push(data.slice())
    }
}