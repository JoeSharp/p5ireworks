const LENGTH_REDUCTION = 0.67
const THICKNESS_REDUCTION = 0.67

class BranchBuilder {
    constructor(begin) {
        this.begin = begin;
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

function branchAt(begin) {
    return new BranchBuilder(begin)
}

class Branch {
    constructor(builder) {
        const ANGLE_SPREAD = PI / 5

        this.begin = builder.begin
        this.length = builder.length
        this.direction = builder.direction
        this.thickness = builder.thickness
        this.branches = []

        // Calculate end
        let end = createVector(0, this.length)
        end.rotate(this.direction)
        this.end = p5.Vector.sub(this.begin, end)

        if (this.length > 2) {
            let newDirection = this.direction - ANGLE_SPREAD
            for (let x=0; x<2; x++) {
                this.branches.push(branchAt(this.end)
                        .withLength(this.length * LENGTH_REDUCTION)
                        .withDirection(newDirection)
                        .withThickness(this.thickness * THICKNESS_REDUCTION)
                        .build())
                newDirection += 2 * ANGLE_SPREAD
            }
        }
    }

    iterateBranches(branchConsumer) {
        branchConsumer(this)
        this.branches.forEach(branch => { 
            branch.iterateBranches(branchConsumer)
        })
    }
}