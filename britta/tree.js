class Branch {
    constructor(begin, length, direction) {
        this.begin = begin
        let end = createVector(0, length)
        end.rotate(direction)
        this.end = p5.Vector.sub(this.begin, end)
        this.length = length

        this.branches = []

        if (this.length > 10) {
            let newDirection = direction - PI / 6
            for (let x=0; x<2; x++) {
                this.branches.push(new Branch(this.end.copy(), this.length * 0.67, newDirection))
                newDirection += PI / 3
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