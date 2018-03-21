const DEFAULT_STATE = 0
const ROWS = 60
const COLS = 120
const WAVE_SPEED = 1

class Tile {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.state = DEFAULT_STATE
    }

    animate(waves) {
        this.state = 0

        waves.forEach(wave => {
            const distance = Math.sqrt(Math.pow(this.x - wave.x, 2) + Math.pow(this.y - wave.y, 2))

            if (Math.round(distance) == Math.round(wave.radius)) {
                this.state = wave.state
            }
        })
    }
}

class Wave {
    constructor(x, y, state) {
        this.x = x
        this.y = y
        this.radius = 0
        this.state = state
    }

    animate() {
        this.radius += WAVE_SPEED
    }

    stillAlive() {
        return (this.radius < ROWS)
    }
}

class RainbowBoard {
    constructor(numberOfStates) {
        this.rows = ROWS
        this.cols = COLS
        this.tiles = new Array()
        this.numberOfStates = numberOfStates
        this.waves = new Array()
        this.nextState = 0

        for (let x=0; x<this.cols; x++) {
            for (let y=0; y<this.rows; y++) {
                const tile = new Tile(x, y)
                this.tiles.push(tile)
            }
        }
    }

    addWave(x, y) {
        const waveState = this.nextState + 1
        this.nextState += 1
        this.nextState %= (this.numberOfStates - 1)
        this.waves.push(new Wave(x, y, waveState))
    }

    animate(frameTime) {
        this.waves.forEach(wave => wave.animate())
        this.waves = this.waves.filter(w => w.stillAlive())

        this.tiles.forEach(tile => tile.animate(this.waves))
    }
}