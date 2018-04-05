
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
const AXIS = [
    X_AXIS, 
    Y_AXIS, 
    Z_AXIS
];

function getCoordinate(axis, vector) {
    switch (axis) {
        case X_AXIS: return vector.x;
        case Y_AXIS: return vector.y;
        case Z_AXIS: return vector.z;
    }
}

function getUnitVector(axis) {
    switch (axis) {
        case X_AXIS: return createVector(1, 0, 0);
        case Y_AXIS: return createVector(0, 1, 0);
        case Z_AXIS: return createVector(0, 0, 1);
    }
}

const INTERNAL_SIDE = -1;
const SIDES = [];
const LOW_FIXED_VALUE = -1;
const HIGH_FIXED_VALUE = 1;
const FIXED_VALUES = [
    LOW_FIXED_VALUE,
    HIGH_FIXED_VALUE
];

const BINARY_CODES = [
    [LOW_FIXED_VALUE, LOW_FIXED_VALUE],
    [LOW_FIXED_VALUE, HIGH_FIXED_VALUE],
    [HIGH_FIXED_VALUE, HIGH_FIXED_VALUE],
    [HIGH_FIXED_VALUE, LOW_FIXED_VALUE]
]

class NamedSide {
    constructor(axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
    }

    isCubeletMatch(cubePosition) {
        let coordValue = getCoordinate(this.axis, cubePosition);
        return (coordValue === this.fixedValue);
    }

    isPanelMatch(cubePosition, cubeSidePanel) {
        if ((cubeSidePanel.axis === this.axis) && (cubeSidePanel.fixedValue === this.fixedValue)){
            return this.isCubeletMatch(cubePosition);
        }

        return false;
    }
}

AXIS.forEach(axis => {
    FIXED_VALUES.forEach(fixedValue => {
        SIDES.push(new NamedSide(axis, fixedValue));
    });
});

class SidePanel {
    constructor(cubePosition, axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
        this.side = INTERNAL_SIDE;
        SIDES.forEach((s, si) => {
            if (s.isPanelMatch(cubePosition, this)) {
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
        this.solvedPosition = createVector(x, y, z);
        this.position = createVector(x, y, z);
        this.sidePanels = [];

        AXIS.forEach(axis => {
            FIXED_VALUES.forEach(fixedValue => {
                this.sidePanels.push(new SidePanel(this.position, axis, fixedValue));
            });
        });
    }
}

function lerpVector(start, end, amount) {
    let x = lerp(start.x, end.x, amount);
    let y = lerp(start.y, end.y, amount);
    let z = lerp(start.z, end.z, amount);
    return createVector(x, y, z);
}

class RotateAnimation {
    constructor(rotateBy, frames, target) {
        this.frame = 0;
        this.frames = frames;
        this.rotateByStep = lerpVector(createVector(), rotateBy, 1 / this.frames);
        this.target = target;
    }

    update() {
        if (this.isDone()) {
            return;
        }
        this.target(this.rotateByStep);

        this.frame++;
    }

    isDone() {
        return (this.frame > this.frames);
    }
}

class RubiksCube {
    constructor() {
        this.cubelets = [];
        this.rotation = createVector();
        this.animations = [];

        for (let x=LOW_FIXED_VALUE; x<=HIGH_FIXED_VALUE; x++) {
            for (let y=LOW_FIXED_VALUE; y<=HIGH_FIXED_VALUE; y++) {
                for (let z=LOW_FIXED_VALUE; z<=HIGH_FIXED_VALUE; z++) {
                    this.cubelets.push(new Cubelet(x, y, z));
                }
            }
        }
        this.sides = SIDES.map(side => 
            this.cubelets
                .map(c => c.solvedPosition)
                .filter(p => side.isCubeletMatch(p))
        );
    }

    update() {
        if (this.animations.length > 0) {
            this.animations[0].update();
            if (this.animations[0].isDone()) {
                this.animations.splice(0, 1);
            }
        }
    }

    resetRotation() {
        this.rotation = createVector();
    }

    rotateSide(side, direction) {
        console.log('Rotating Side ' + side + ' in direction ' + direction);
    }

    rotateCube(rotateBy) {
        this.animations.push(new RotateAnimation(rotateBy, 1, (r) => {
            this.rotation.add(r);
        }));
    }
}