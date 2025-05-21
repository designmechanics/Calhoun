let particles = [];
let sphereColor;

function setup() {
  createCanvas(400, 400);
  sphereColor = color(220); // Light gray for the sphere
}

function draw() {
  background(240); // Slightly lighter background

  // Sphere with a subtle gradient to simulate gloss
  let sphereCenterX = width / 2;
  let sphereCenterY = height / 2;
  let sphereRadius = min(width, height) * 0.4;

  for (let i = 0; i < sphereRadius; i++) {
    let lightness = map(i, 0, sphereRadius, 255, 220); // Gradient effect
    fill(lightness);
    noStroke();
    ellipse(sphereCenterX, sphereCenterY, sphereRadius * 2 - i * 2, sphereRadius * 2 - i * 2);
  }

  // Particle system simulating ink flow
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  // Remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

function mouseMoved() {
  // Emit particles near the mouse position
  for (let i = 0; i < 5; i++) { // Adjust number of particles emitted
    let p = new Particle(mouseX + random(-10, 10), mouseY + random(-10, 10));
    particles.push(p);
  }
}

// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1); // Initial X velocity
    this.vy = random(-1, 1); // Initial Y velocity
    this.alpha = 255; // Opacity
    this.size = random(2, 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 2; // Fade out
  }

  finished() {
    return this.alpha < 0;
  }

  show() {
    noStroke();
    fill(0, this.alpha); // Black with opacity
    ellipse(this.x, this.y, this.size);
  }
}
