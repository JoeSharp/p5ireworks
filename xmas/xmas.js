const WIDTH = 500
const HEIGHT = 500
const FRAME_RATE = 30
const FRAME_TIME = 1.0 / FRAME_RATE

const INITIAL_DROP_INTERVAL = 2.0
const SHORTEST_DROP_INTERVAL = 0.1
const DROP_INTERVAL_STEP = 0.1
const INTERVAL_SHIFT_TIME = 2.0

const DROP_X_JITTER = 0.2
const MAX_SIZE = 10
const MIN_SIZE = 4
const BAUBLE_SIZE = 10
const COLLISION_THRESHOLD = 10
const BAUBLE_MARGIN = 5

const COLOURS = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

class Drop {
    constructor() {
        this.finished = false
        this.x = Math.random() * WIDTH
        this.y = 0
        this.speed = 1.0
        this.size = (Math.random() * (MAX_SIZE - MIN_SIZE)) + MIN_SIZE
        const colourIndex = Math.floor(Math.random() * COLOURS.length)
        this.colour = COLOURS[colourIndex]
        this.xJitter = 0
    }

    run(frameTime) {
        // Is the drop finished?
        if (this.y > HEIGHT) {
            this.finished = true;
        } else {
            this.y += this.speed

            // Adjust the downwards jitter
            this.xJitter += (Math.random() * DROP_X_JITTER) - (DROP_X_JITTER / 2)
            this.x += this.xJitter 
        }

        // Now draw it
        fill(this.colour)
        ellipse(this.x, this.y, this.size)
    }
}

const BAUBLE_STATE = {
    WAITING: 1,
    ACTIVE: 2
}

class Bauble {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.colour = 'grey'
        this.size = BAUBLE_SIZE
        this.state = BAUBLE_STATE.WAITING
    }

    checkDrop(drop) {
        if (this.state === BAUBLE_STATE.WAITING) {
            var a = this.x - drop.x
            var b = this.y - drop.y
            
            var c = Math.sqrt( a*a + b*b );

            if (c < COLLISION_THRESHOLD) {
                drop.finished = true
                this.state = BAUBLE_STATE.ACTIVE
                this.colour = drop.colour
                this.size = drop.size
            }
        }
    }

    run(frameTime) {
        switch (this.state) {
            case BAUBLE_STATE.WAITING: {
                break;
            }
            case BAUBLE_STATE.ACTIVE: {
                fill('white')
                ellipse(this.x, this.y, (this.size + BAUBLE_MARGIN))
                fill(this.colour)
                ellipse(this.x, this.y, this.size)
                break;
            }
        }
    }
}

class CaptureBauble {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    run(frameTime) {
        fill('grey')
        ellipse(this.x, this.y, BAUBLE_SIZE)
    }
}


class Rain {
    constructor() {
        this.frameTime = 0
        this.dropInterval = INITIAL_DROP_INTERVAL
        this.lastDropTime = 0
        this.lastShiftTime = 0
        this.drops = []
        this.baubles = []
    }

    addBauble(bauble) {
        this.baubles.push(bauble)
    }

    clearBaubles() {
        this.baubles = []
    }

    run() {
        this.frameTime += FRAME_TIME

        // Create a new drop if appropriate
        if ((this.frameTime - this.lastDropTime) > this.dropInterval) {
            this.drops.push(new Drop())
            this.lastDropTime = this.frameTime
        }

        // Shorten the drop interval if appropriate
        // Is the drop interval still above the minimum?
        // Has it been long enough since the last shift?
        if ((this.dropInterval > SHORTEST_DROP_INTERVAL)
            && ((this.frameTime - this.lastShiftTime) > INTERVAL_SHIFT_TIME)) {
            this.lastShiftTime = this.frameTime
            this.dropInterval -= DROP_INTERVAL_STEP
        }

        // Now run all the drops and baubles
        this.drops.forEach(d => {
            d.run(this.frameTime)
            this.baubles.forEach(b => {
                b.checkDrop(d)
            })
        })
        this.drops = this.drops.filter(d => !d.finished);
        this.baubles.forEach(b => b.run(this.frameTime))
    }
}