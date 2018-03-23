const LENGTH_REDUCTION = 0.67
const THICKNESS_REDUCTION = 0.67

let branchId = 0

class BranchBuilder {
    constructor(parentBranch) {
        this.parentBranch = parentBranch;
        this.length = 100;
        this.direction = 0;
        this.thickness = 20;
    }

    withLength(l) {
        this.length = l;
        return this;
    }

    withDirection(l) {
        this.direction = l;
        return this;
    }

    withThickness(l) {
        this.thickness = l;
        return this;
    }

    build() {
        return new Branch(this);
    }
}

function rootBranch(begin) {
    return new BranchBuilder({
        depth: 0,
        end: begin
    })
}

function branchFrom(parentBranch) {
    return new BranchBuilder(parentBranch);
}

class Branch {
    constructor(builder) {
        const ANGLE_SPREAD = PI / 5

        this.branchId = branchId
        branchId += 1
        this.parentBranch = builder.parentBranch
        this.depth = builder.parentBranch.depth + 1
        let random = map(Math.random(), 0, 1, 0.7, 1.4)
        this.length = builder.length * random
        this.direction = builder.direction
        this.originalDirection = builder.direction
        this.thickness = builder.thickness
        this.branches = []

        if (this.depth < 10) {
            let newDirection = this.direction - ANGLE_SPREAD
            for (let x=0; x<2; x++) {
                this.branches.push(branchFrom(this)
                        .withLength(this.length * LENGTH_REDUCTION)
                        .withDirection(newDirection)
                        .withThickness(this.thickness * THICKNESS_REDUCTION)
                        .build())
                newDirection += 2 * ANGLE_SPREAD
            }
        }
    }

    iterateBranches(branchConsumer) {
        // Re-calculate end
        let end = createVector(0, this.length)
        end.rotate(this.direction)
        this.end = p5.Vector.sub(this.parentBranch.end, end)

        branchConsumer(this)
        this.branches.forEach(branch => { 
            branch.iterateBranches(branchConsumer)
        })
    }

    resetGrowth() {

    }
}