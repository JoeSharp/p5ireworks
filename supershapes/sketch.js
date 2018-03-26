const RADIUS = 200;
const RESOLUTION = 100;

let cameraX = 0;
let cameraY = 0;

function setup() {
  createCanvas(500, 500, WEBGL);
  
  

  colorMode(HSB)
}

function draw() {
  background('black')
  noStroke()
  
  rotateX(2 * sin(cameraX))
  rotateY(1 * cos(cameraY))
 
  const sphere = []

  // Calculate points
  for (let i=0; i < RESOLUTION+1; i++) {
    const latitude = map(i, 0, RESOLUTION, 0, PI);
    const pointsAtLatitude = []
    for (let j=0; j < RESOLUTION+1; j++) {
      const longitude = map(j, 0, RESOLUTION, 0, TWO_PI);

      const x = RADIUS * sin(latitude) * cos(longitude);
      const y = RADIUS * sin(latitude) * sin(longitude);
      const z = RADIUS * cos(latitude);

      const rawPoint = createVector(x, y, z);
      const noiseValue = map(noise(x+(10 * cameraX), y, z), 0, 1, -10, 10)
      const randomVector = createVector(noiseValue,noiseValue,noiseValue)
      const point = p5.Vector.add(rawPoint, randomVector)
      
      //console.log('Random?', randomVector);
      
      pointsAtLatitude.push({
        longitude,
        point
      })
    }

    sphere.push({
      latitude,
      points: pointsAtLatitude
    })
  }

  for (let i=0; i < RESOLUTION; i++) {
    latitude = sphere[i];
    latitudeP1 = sphere[i + 1];

    let hu = map(i, 0, RESOLUTION, 0, 255 * 1)
    fill(hu % 255, 255, 255)

    beginShape(TRIANGLE_STRIP); 
    for (let j=0; j < RESOLUTION+1; j++) {

      longitude = latitude.points[j];
      longitudeP1 = latitudeP1.points[j];

      vertex(longitude.point.x, longitude.point.y, longitude.point.z);
      vertex(longitudeP1.point.x, longitudeP1.point.y, longitudeP1.point.z);
    }
    endShape(CLOSE);
  }

  cameraX += 0.005;
  cameraY += 0.005;
}

