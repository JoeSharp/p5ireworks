class BubbleSort {
    run(initialData, update) {
        let data = initialData.slice()

        // Manipulate the data
        
        for (let top = data.length; top > 1; top--) {
            for (let current = 0; current < top; current++) {
                if (data[current] > data[current + 1]) {
                    let swap = data[current]
                    data[current] = data[current + 1]
                    data[current + 1] = swap
                    update(data)
                }
            }
        }
    }
}

let data = []
for (let x=0; x < 10; x++) {
    let randomNumber = Math.random() * 100
    let roundedNumber = Math.floor(randomNumber)
    data.push(roundedNumber)
}

console.log(data)

new BubbleSort().run(data, d => console.log(d))