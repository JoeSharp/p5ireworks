
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
const AXIS = [
    X_AXIS, 
    Y_AXIS, 
    Z_AXIS
];

const INTERNAL_SIDE = -1;
const LEFT_SIDE = 0;
const RIGHT_SIDE = 1;
const TOP_SIDE = 2;
const BOTTOM_SIDE = 3;
const NEAR_SIDE = 4;
const FAR_SIDE = 5;
const SIDES = [
    INTERNAL_SIDE,
    LEFT_SIDE,
    RIGHT_SIDE,
    TOP_SIDE,
    BOTTOM_SIDE,
    NEAR_SIDE,
    FAR_SIDE
]

const BINARY_CODES = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
]

class CubeSide {
    constructor(parentCubelet, axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
        this.side = INTERNAL_SIDE;
        if ((parentCubelet.x === -1) && (axis === X_AXIS)) {
            if (fixedValue === 0) {
                this.side = LEFT_SIDE;
            }
        }
        else if ((parentCubelet.x === 1) && (axis === X_AXIS)) {
            if (fixedValue === 1) {
                this.side = RIGHT_SIDE;
            }
        }
        else if ((parentCubelet.y === -1) && (axis === Y_AXIS)) {
            if (fixedValue === 0) {
                this.side = BOTTOM_SIDE;
            }
        }
        else if ((parentCubelet.y === 1) && (axis === Y_AXIS)) {
            if (fixedValue === 1) {
                this.side = TOP_SIDE;
            }
        }
        else if ((parentCubelet.z === -1) && (axis === Z_AXIS)) {
            if (fixedValue === 0) {
                this.side = NEAR_SIDE;
            }
        }
        else if ((parentCubelet.z === 1) && (axis === Z_AXIS)) {
            if (fixedValue === 1) {
                this.side = FAR_SIDE;
            }
        }

        switch (axis) {
            case X_AXIS:
                this.vertices = BINARY_CODES
                    .map(b => createVector(fixedValue, b[0], b[1]))
                break;
            case Y_AXIS:
                this.vertices = BINARY_CODES
                    .map(b => createVector(b[0], fixedValue, b[1]))
                break;
            case Z_AXIS:
                this.vertices = BINARY_CODES
                    .map(b => createVector(b[0], b[1], fixedValue))
                break;
        }
    }
}

class Cubelet {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.sides = [];

        AXIS.forEach(axis => {
            for (let fixedValue=0; fixedValue<2; fixedValue++) {
                this.sides.push(new CubeSide(this, axis, fixedValue));
            }
        });
    }
}

class RubiksCube {
    constructor() {
        this.cubelets = [];

        for (let x=-1; x<2; x++) {
            for (let y=-1; y<2; y++) {
                for (let z=-1; z<2; z++) {
                    this.cubelets.push(new Cubelet(x, y, z));
                }
            }
        }
    }
}