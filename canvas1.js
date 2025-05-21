let nodes = [];
const numNodes = 30; // Number of nodes in the graph
let equilibriumX = []; // x positions when at rest
let equilibriumY = []; // y positions when at rest
let buttonState = false; // Tracks button state

function setup() {
  createCanvas(400, 400);
  // Initialize nodes with random positions
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: random(width * 0.3, width * 0.7),
      y: random(height * 0.3, height * 0.7),
      vx: 0,
      vy: 0,
      mass: 1
    });
  }
  setEquilibrium(); // Set starting equilibrium config
}

function draw() {
  background(240); // Light gray background

  // Draw the button outline
  let buttonRadius = height * 0.4; // Radius of the button
  fill(255);
  stroke(200);
  strokeWeight(2);
  ellipse(width / 2, height / 2, buttonRadius * 2);

  // Apply force-directed layout
  for (let i = 0; i < numNodes; i++) {
    let node = nodes[i];

    // Attraction to equilibrium position
    let dx = equilibriumX[i] - node.x;
    let dy = equilibriumY[i] - node.y;
    let forceX = dx * 0.05;
    let forceY = dy * 0.05;

    // Repulsion from other nodes
    for (let j = 0; j < numNodes; j++) {
      if (i !== j) {
        let other = nodes[j];
        let distance = dist(node.x, node.y, other.x, other.y);
        if (distance > 0 && distance < 50) { // Repulse only if close
          let repelX = (node.x - other.x) / distance;
          let repelY = (node.y - other.y) / distance;
          forceX += repelX * 2;
          forceY += repelY * 2;
        }
      }
    }

    // Damping and integration
    node.vx = (node.vx + forceX / node.mass) * 0.8;
    node.vy = (node.vy + forceY / node.mass) * 0.8;
    node.x += node.vx;
    node.y += node.vy;

    // Keep nodes within button bounds
    let distanceToCenter = dist(node.x, node.y, width / 2, height / 2);
    if (distanceToCenter > buttonRadius) {
      let angle = atan2(node.y - height / 2, node.x - width / 2);
      node.x = width / 2 + cos(angle) * buttonRadius;
      node.y = height / 2 + sin(angle) * buttonRadius;
      node.vx = 0;
      node.vy = 0;
    }

    // Draw nodes and connections
    fill(0);
    noStroke();
    ellipse(node.x, node.y, 5);
    for (let j = i + 1; j < numNodes; j++) {
      stroke(100, 50);
      line(node.x, node.y, nodes[j].x, nodes[j].y);
    }
  }
}

function mouseClicked() {
  // Switch the button state
  buttonState = !buttonState;
  setEquilibrium();
}

function setEquilibrium() {
  // Define equilibrium positions to resemble the shape of the logo
  // These are rough approximations, adjust as needed
  equilibriumX = [];
  equilibriumY = [];
  if (!buttonState) { // Button "off" state
    for (let i = 0; i < numNodes; i++) {
      let angle = map(i, 0, numNodes, 0, TWO_PI);
      equilibriumX.push(width / 2 + cos(angle) * width * 0.15);
      equilibriumY.push(height / 2 + sin(angle) * height * 0.15);
    }
  } else { // Button "on" state - different equilibrium
    for (let i = 0; i < numNodes; i++) {
      let angle = map(i, 0, numNodes, 0, TWO_PI);
      equilibriumX.push(width / 2 + cos(angle * 2) * width * 0.2);
      equilibriumY.push(height / 2 + sin(angle / 2) * height * 0.1);
    }
  }
}
