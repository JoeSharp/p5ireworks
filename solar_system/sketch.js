

function setup() {
    createCanvas(400, 300);
}

function draw() {
    colorMode(RGB);
    background(0, 0, 0, 25);
    colorMode(HSB);

    if (random(1) < 0.05) {
        fireworks.push(new Firework());
    }

    fireworks.forEach(f => {
        f.update();
        f.show();
    })

    fireworks = fireworks.filter(f => !f.done());
}