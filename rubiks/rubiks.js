
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
const AXIS = [
    X_AXIS, 
    Y_AXIS, 
    Z_AXIS
];

const BINARY_CODES = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
]

class NamedSide {
    constructor(axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
    }

    isMatch(cubeSide) {
        return ((cubeSide.axis === this.axis) && (cubeSide.fixedValue === this.fixedValue));
    }
}

const INTERNAL_SIDE = -1;
const SIDES = [];
const LOW_FIXED_VALUE = 0;
const HIGH_FIXED_VALUE = 1;
const FIXED_VALUES = [
    LOW_FIXED_VALUE,
    HIGH_FIXED_VALUE
];

AXIS.forEach(axis => {
    FIXED_VALUES.forEach(fixedValue => {
        SIDES.push(new NamedSide(axis, fixedValue));
    });
});

class CubeSide {
    constructor(parentCubelet, axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
        this.side = INTERNAL_SIDE;
        SIDES.forEach((s, si) => {
            if (s.isMatch(this)) {
                this.side = si;
            }
        });

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
            FIXED_VALUES.forEach(fixedValue => {
                this.sides.push(new CubeSide(this, axis, fixedValue));
            });
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