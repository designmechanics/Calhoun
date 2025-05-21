const sketch2 = (p) => {
  let particles = [];
  let sphereColor;

  p.setup = () => {
    let canvas = p.createCanvas(400, 400);
    canvas.parent('canvas2');
    sphereColor = p.color(220); // Light gray for the sphere
  };

  p.draw = () => {
    p.background(240); // Slightly lighter background

    // Sphere with a subtle gradient to simulate gloss
    let sphereCenterX = p.width / 2;
    let sphereCenterY = p.height / 2;
    let sphereRadius = p.min(p.width, p.height) * 0.4;

    for (let i = 0; i < sphereRadius; i++) {
      let lightness = p.map(i, 0, sphereRadius, 255, 220); // Gradient effect
      p.fill(lightness);
      p.noStroke();
      p.ellipse(sphereCenterX, sphereCenterY, sphereRadius * 2 - i * 2, sphereRadius * 2 - i * 2);
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
  };

  p.mouseMoved = () => {
    // Emit particles near the mouse position
    for (let i = 0; i < 5; i++) { // Adjust number of particles emitted
      let particle = new Particle(p.mouseX + p.random(-10, 10), p.mouseY + p.random(-10, 10));
      particles.push(particle);
    }
  };

  // Particle class
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = p.random(-1, 1); // Initial X velocity
      this.vy = p.random(-1, 1); // Initial Y velocity
      this.alpha = 255; // Opacity
      this.size = p.random(2, 5);
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
      p.noStroke();
      p.fill(0, this.alpha); // Black with opacity
      p.ellipse(this.x, this.y, this.size);
    }
  }
};
new p5(sketch2);
