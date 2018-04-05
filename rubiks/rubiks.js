
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
const AXIS = [
    X_AXIS, 
    Y_AXIS, 
    Z_AXIS
];
const COORDINATE_GETTER = {}
COORDINATE_GETTER[X_AXIS] = (p) => p.x;
COORDINATE_GETTER[Y_AXIS] = (p) => p.y;
COORDINATE_GETTER[Z_AXIS] = (p) => p.z;

const BINARY_CODES = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
]

const INTERNAL_SIDE = -1;
const SIDES = [];
const LOW_FIXED_VALUE = 0;
const HIGH_FIXED_VALUE = 1;
const FIXED_VALUES = [
    LOW_FIXED_VALUE,
    HIGH_FIXED_VALUE
];

class NamedSide {
    constructor(axis, fixedValue) {
        this.axis = axis;
        this.fixedValue = fixedValue;
    }

    isCubeletMatch(cubePosition) {
        let coordValue = COORDINATE_GETTER[this.axis](cubePosition);
        if ((coordValue === -1) && (this.fixedValue === 0)) {
            return true;
        } else if ((coordValue === 1) && (this.fixedValue === 1)) {
            return true;
        }

        return false;
    }

    isPanelMatch(cubePosition, cubeSidePanel) {
        if ((cubeSidePanel.axis === this.axis) && (cubeSidePanel.fixedValue === this.fixedValue)){
            let coordValue = COORDINATE_GETTER[this.axis](cubePosition);
            if ((coordValue === -1) && (this.fixedValue === 0)) {
                return true;
            } else if ((coordValue === 1) && (this.fixedValue === 1)) {
                return true;
            }
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

        for (let x=-1; x<2; x++) {
            for (let y=-1; y<2; y++) {
                for (let z=-1; z<2; z++) {
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