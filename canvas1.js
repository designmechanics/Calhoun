const sketch1 = (p) => {
  let nodes = [];
  const numNodes = 30; // Number of nodes in the graph
  let equilibriumX = []; // x positions when at rest
  let equilibriumY = []; // y positions when at rest
  let buttonState = false; // Tracks button state

  p.setup = () => {
    let canvas = p.createCanvas(400, 400);
    canvas.parent('canvas1');
    // Initialize nodes with random positions
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: p.random(p.width * 0.3, p.width * 0.7),
        y: p.random(p.height * 0.3, p.height * 0.7),
        vx: 0,
        vy: 0,
        mass: 1
      });
    }
    p.setEquilibrium(); // Set starting equilibrium config
  };

  p.draw = () => {
    p.background(240); // Light gray background

    // Draw the button outline
    let buttonRadius = p.height * 0.4; // Radius of the button
    p.fill(255);
    p.stroke(200);
    p.strokeWeight(2);
    p.ellipse(p.width / 2, p.height / 2, buttonRadius * 2);

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
          let distance = p.dist(node.x, node.y, other.x, other.y);
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
      let distanceToCenter = p.dist(node.x, node.y, p.width / 2, p.height / 2);
      if (distanceToCenter > buttonRadius) {
        let angle = p.atan2(node.y - p.height / 2, node.x - p.width / 2);
        node.x = p.width / 2 + p.cos(angle) * buttonRadius;
        node.y = p.height / 2 + p.sin(angle) * buttonRadius;
        node.vx = 0;
        node.vy = 0;
      }

      // Draw nodes and connections
      p.fill(0);
      p.noStroke();
      p.ellipse(node.x, node.y, 5);
      for (let j = i + 1; j < numNodes; j++) {
        p.stroke(100, 50);
        p.line(node.x, node.y, nodes[j].x, nodes[j].y);
      }
    }
  };

  p.mouseClicked = () => {
    // Switch the button state
    buttonState = !buttonState;
    p.setEquilibrium();
  };

  p.setEquilibrium = () => {
    // Define equilibrium positions to resemble the shape of the logo
    // These are rough approximations, adjust as needed
    equilibriumX = [];
    equilibriumY = [];
    if (!buttonState) { // Button "off" state
      for (let i = 0; i < numNodes; i++) {
        let angle = p.map(i, 0, numNodes, 0, p.TWO_PI);
        equilibriumX.push(p.width / 2 + p.cos(angle) * p.width * 0.15);
        equilibriumY.push(p.height / 2 + p.sin(angle) * p.height * 0.15);
      }
    } else { // Button "on" state - different equilibrium
      for (let i = 0; i < numNodes; i++) {
        let angle = p.map(i, 0, numNodes, 0, p.TWO_PI);
        equilibriumX.push(p.width / 2 + p.cos(angle * 2) * p.width * 0.2);
        equilibriumY.push(p.height / 2 + p.sin(angle / 2) * p.height * 0.1);
      }
    }
  };
};
new p5(sketch1);
