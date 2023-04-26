const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


let elapsedTime = 0;
let score = 0;
let gameOver = false;

// Load the font using FontFaceObserver
const font = new FontFaceObserver('Roboto');

font.load().then(() => {
    // The font is now loaded and can be used in the canvas
    console.log('Font is now available');
}).catch((err) => {
    console.error('Error loading font:', err);
});


const gasButton = document.createElement('button');
gasButton.innerHTML = `
  <svg width="50" height="50" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1" fill="none" opacity="0.5" />
    <path d="M12 7l-4 4h3v4h2v-4h3z" fill="white" opacity="0.5" />
  </svg>
`;
gasButton.style.position = 'absolute';
gasButton.style.padding = '0';
gasButton.style.border = 'none';
gasButton.style.background = 'none';

// Create the brake button with a down arrow in a circle
const brakeButton = document.createElement('button');
brakeButton.innerHTML = `
  <svg width="50" height="50" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1" fill="none" opacity="0.5" />
    <path d="M12 17l4-4h-3v-4h-2v4h-3z" fill="white" opacity="0.5" />
  </svg>
`;
brakeButton.style.position = 'absolute';
brakeButton.style.padding = '0';
brakeButton.style.border = 'none';
brakeButton.style.background = 'none';


function drawTimer() {
    ctx.fillStyle = 'white';
        ctx.font = '24px Roboto'; // Change the font to 'Roboto'

    ctx.fillText(`Time: ${elapsedTime.toFixed(1)}s`, 10, 30);
    ctx.fillText(`Score: ${score.toFixed(1)}`, 200, 30);
    //ctx.fillText('Score: ' + score.toFixed(1), 120, 20);

}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Roboto';
    ctx.fillText('Game Over', canvas.width / 2 - 110, canvas.height / 2);
    ctx.fillText(`Score: ${score.toFixed(1)}`, canvas.width / 2 - 110, canvas.height / 2 + 50);

}

function drawBullsEye() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const colors = ['rgba(173, 216, 230, 0.05)', 'rgba(173, 216, 230, 0.05)', 'rgba(173, 216, 230, 0.05)'];
    const sizes = [150, 300, 450];

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, sizes[i], 0, Math.PI * 2, false);
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
}

function checkSpaceshipInBullsEye() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sizes = [150, 300, 450];

    let points = 0;
    for (let i = 0; i < 3; i++) {
        const dx = centerX - spaceship.x;
        const dy = centerY - spaceship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < sizes[i]) {
            points += 0.1;
        }
    }

        const dx = centerX - spaceship.x;
        const dy = centerY - spaceship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 450) {
            points -= 0.1;
        }

    return points;
}


const stars = [];

function generateStars() {
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        stars.push({ x, y, radius });
    }
}


generateStars();

function drawStarryBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}



//function generatePlanets(numPlanets) {
//
//    for (let i = 0; i < numPlanets; i++) {
//        const x = Math.random() * canvas.width;
//        const y = Math.random() * canvas.height;
//
//        const radius = 5 + Math.random() * 70; // Generates a random radius between 10 and 50
//        const mass = radius * 5 ; // Adjust the mass based on the radius
//
//    
//
//        const planet = new Planet(x, y, radius, mass);
//        planets.push(planet);
//    }
//}


function generatePlanets(numPlanets) {
    for (let i = 0; i < numPlanets; i++) {
        let x, y, distance;

        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;

            // Calculate the distance between the generated position and the center of the screen
            const dx = x - canvas.width / 2;
            const dy = y - canvas.height / 2;
            distance = Math.sqrt(dx * dx + dy * dy);
        } while (distance < 300); // Regenerate the position if the distance is less than 300 pixels

        const radius = 5 + Math.random() * 70; // Generates a random radius between 10 and 50
        const mass = radius * 5; // Adjust the mass based on the radius

        const planet = new Planet(x, y, radius, mass);
        planets.push(planet);
    }
}

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function isCollidingWithEdge(obj, radius) {
    return (
        obj.x - radius < 0 ||
        obj.x + radius > canvas.width ||
        obj.y - radius < 0 ||
        obj.y + radius > canvas.height
    );
}

function handleEdgeCollision(obj, radius) {
    if (obj.x - radius < 0) {
        obj.x = radius;
        obj.vx = Math.abs(obj.vx);
    } else if (obj.x + radius > canvas.width) {
        obj.x = canvas.width - radius;
        obj.vx = -Math.abs(obj.vx);
    }

    if (obj.y - radius < 0) {
        obj.y = radius;
        obj.vy = Math.abs(obj.vy);
    } else if (obj.y + radius > canvas.height) {
        obj.y = canvas.height - radius;
        obj.vy = -Math.abs(obj.vy);
    }
}



class Particle {
  constructor(x, y, speed, angle, size, life) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.life = 0.7; // Particle's lifespan, where 1 is 100% and 0 is 0%
  }

update(deltaTime) {
  this.x += this.speed * Math.cos(this.angle) * deltaTime / 1000;
  this.y += this.speed * Math.sin(this.angle) * deltaTime / 1000;
  this.life -= 0.01 * deltaTime / 16.67; // Assuming 60 FPS, adjust the denominator for different frame rates
}

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 165, 0, ${this.life})`; // Orange color with alpha based on life
    ctx.fill();
  }
}




class Spaceship {
    constructor(x, y, size, mass) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.mass = mass;
        this.angle = 0; // Angle in radians
        this.vx = 0;
        this.vy = 0;
        this.thrust = 0;
        this.turnSpeed = 0;
        this.trail = [];
        this.showFlame = false;
        this.particles = [];

    }

    draw() {

   ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    // Draw flame
    if (this.showFlame) {
        const backX = this.x - 0.5 * this.size * Math.cos(this.angle);
        const backY = this.y - 0.5 * this.size * Math.sin(this.angle);
        const size = this.size * 0.5;

        ctx.beginPath();
        ctx.moveTo(backX, backY);
        ctx.lineTo(
            backX + size * Math.cos(this.angle + Math.PI / 2),
            backY + size * Math.sin(this.angle + Math.PI / 2)
        );
        ctx.lineTo(
            backX - size * Math.cos(this.angle),
            backY - size * Math.sin(this.angle)
        );
        ctx.lineTo(
            backX - size * Math.cos(this.angle + Math.PI / 2),
            backY - size * Math.sin(this.angle + Math.PI / 2)
        );
        ctx.closePath();
        ctx.fillStyle = 'orange';
        ctx.fill();

      const particle = new Particle(
      backX,
      backY,
      50, // Adjust speed as needed
      this.angle + Math.PI + (Math.random() * 0.5 - 0.25),
      0.5, // Adjust life duration as needed
      2 // Adjust particle size as needed
    );
    this.particles.push(particle);
    }


        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.size, 0); // Point to the right by default
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, -this.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }


}

const spaceship = new Spaceship(canvas.width * 0.5, canvas.height / 2, 15, 1); // Adjust the mass value as needed


class Planet {
    constructor(x, y, radius, mass, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
        this.previousPositions = [];
        this.trailLength = 100; // Adjust this value to control the length of the trail
        this.color = randomColor();
    }


getColorComponents() {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = this.color.match(regex);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return { r, g, b };
  } else {
    console.error("Invalid color format");
    return { r: 0, g: 0, b: 0 };
  }
}

drawTrail() {
  if (this.previousPositions.length < 2) {
    return;
  }

  ctx.lineWidth = 1;

  const { r, g, b } = this.getColorComponents(); // Get the RGB values

  for (let i = 0; i < this.previousPositions.length - 1; i++) {
    const opacity = 1 - (i / (this.previousPositions.length - 1)); // Calculate the opacity based on the position index
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    ctx.beginPath();
    ctx.moveTo(this.previousPositions[i].x, this.previousPositions[i].y);
    ctx.lineTo(this.previousPositions[i + 1].x, this.previousPositions[i + 1].y);
    ctx.stroke();
  }
}

    draw() {
        this.drawTrail();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
        ctx.closePath();
        ctx.fill();


    }
}

const planets = [
];

generatePlanets(7); // Pass the desired number of planets here

function handleElasticCollision(obj1, obj2, radius1, radius2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = radius1 + radius2;

    const overlap = minDistance - distance;
    const angle = Math.atan2(dy, dx);

    obj1.x -= Math.cos(angle) * (overlap / 2);
    obj1.y -= Math.sin(angle) * (overlap / 2);
    obj2.x += Math.cos(angle) * (overlap / 2);
    obj2.y += Math.sin(angle) * (overlap / 2);

    const v1 = Math.sqrt(obj1.vx * obj1.vx + obj1.vy * obj1.vy);
    const v2 = Math.sqrt(obj2.vx * obj2.vx + obj2.vy * obj2.vy);

    const dir1 = Math.atan2(obj1.vy, obj1.vx);
    const dir2 = Math.atan2(obj2.vy, obj2.vx);

    const vx1 = v1 * Math.cos(dir1 - angle);
    const vy1 = v1 * Math.sin(dir1 - angle);
    const vx2 = v2 * Math.cos(dir2 - angle);
    const vy2 = v2 * Math.sin(dir2 - angle);

    const massSum = (obj1.mass + obj2.mass);

    const finalVx1 = ((obj1.mass - obj2.mass) * vx1 + 2 * obj2.mass * vx2) / massSum;
    const finalVx2 = ((obj2.mass - obj1.mass) * vx2 + 2 * obj1.mass * vx1) / massSum;

    obj1.vx = Math.cos(angle) * finalVx1 + Math.cos(angle + Math.PI / 2) * vy1;
    obj1.vy = Math.sin(angle) * finalVx1 + Math.sin(angle + Math.PI / 2) * vy1;
    obj2.vx = Math.cos(angle) * finalVx2 + Math.cos(angle + Math.PI / 2) * vy2;
    obj2.vy = Math.sin(angle) * finalVx2 + Math.sin(angle + Math.PI / 2) * vy2;
}


function handleCollisions() {
    for (let i = 0; i < planets.length; i++) {
        const planet1 = planets[i];

        // Check collisions between planets
        for (let j = i + 1; j < planets.length; j++) {
            const planet2 = planets[j];
            const dx = planet1.x - planet2.x;
            const dy = planet1.y - planet2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radiusSum = planet1.radius + planet2.radius;

            if (distance <= radiusSum) {
                // Handle planet-planet collision
                handleElasticCollision(planet1, planet2, planet1.radius, planet2.radius);
            }
        }

        // Check collision between the spaceship and the current planet
        const dx = spaceship.x - planet1.x;
        const dy = spaceship.y - planet1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radiusSum = spaceship.size + planet1.radius;

        if (distance <= radiusSum) {
            // Handle spaceship-planet collision
            //handleElasticCollision(spaceship, planet1, spaceship.size, planet1.radius);
                        gameOver = true;

        }
    }
}


function handleEdgeCollisions() {
    for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];

        if (isCollidingWithEdge(planet, planet.radius)) {
            handleEdgeCollision(planet, planet.radius);
        }
    }

    if (isCollidingWithEdge(spaceship, spaceship.size)) {
        //handleEdgeCollision(spaceship, spaceship.size);
                gameOver = true;

    }
}



// const G = 6.67430e-11; // Gravitational constant
const G = 5000; // Gravitational constant

function update(deltaTime) {

if (!gameOver) {
        elapsedTime += 1 / 60;
        score += checkSpaceshipInBullsEye();

        if (score < 0){
            score = 0;
        }



    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const p1 = planets[i];
            const p2 = planets[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const force = (G * p1.mass * p2.mass) / (distance * distance);
            const forceX = force * dx / distance;
            const forceY = force * dy / distance;

            p1.vx += (forceX / p1.mass) * (deltaTime / 1000);
            p1.vy += (forceY / p1.mass) * (deltaTime / 1000);
            p2.vx -= (forceX / p2.mass) * (deltaTime / 1000);
            p2.vy -= (forceY / p2.mass) * (deltaTime / 1000);
        }
    }

   for (const planet of planets) {
        // Store the previous position
        planet.previousPositions.unshift({ x: planet.x, y: planet.y });

        // Limit the number of stored positions to the trail length
        if (planet.previousPositions.length > planet.trailLength) {
            planet.previousPositions.pop();
        }

        planet.x += planet.vx * (deltaTime / 1000);
        planet.y += planet.vy * (deltaTime / 1000);
    }

    handleCollisions(); // Handle collisions between planets
        handleEdgeCollisions(); // Add this line


        // Update spaceship's angle and apply thrust
    spaceship.angle += spaceship.turnSpeed * (deltaTime / 1000);
    spaceship.vx += spaceship.thrust * Math.cos(spaceship.angle) * (deltaTime / 1000);
    spaceship.vy += spaceship.thrust * Math.sin(spaceship.angle) * (deltaTime / 1000);

  // Update particles
  spaceship.particles.forEach((particle, index) => {
    particle.update(deltaTime);
    if (particle.life <= 0) {
      spaceship.particles.splice(index, 1);
    }
  });


    // Apply gravity from planets to the spaceship
for (const planet of planets) {
    const dx = planet.x - spaceship.x;
    const dy = planet.y - spaceship.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    //const force = (G * spaceship.mass * planet.mass) / (distance * distance);
    const force = (G * planet.mass) / (distance * distance);
    const forceX = force * dx / distance;
    const forceY = force * dy / distance;

    spaceship.vx += (forceX / spaceship.mass) * (deltaTime / 1000);
    spaceship.vy += (forceY / spaceship.mass) * (deltaTime / 1000);
}

    // Update spaceship's position
    spaceship.x += spaceship.vx * (deltaTime / 1000);
    spaceship.y += spaceship.vy * (deltaTime / 1000);


   //     spaceship.trail.push({ x: spaceship.x, y: spaceship.y });
   // if (spaceship.trail.length > 50) { // Limit the trail length
   //     spaceship.trail.shift();
   // }

}
}

function draw() {




    ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawStarryBackground();



        drawBullsEye();


    for (const planet of planets) {
        planet.draw();
    }


   spaceship.particles.forEach((particle) => {
    particle.draw(ctx);
  });


    spaceship.draw();

        drawTimer();

   if (gameOver) {
        drawGameOver();
    }




}


function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    if (!gameOver) {
        return;
    }

    // Initialize the game state
    initGame();
}

function initGame() {
    gameOver = false;
    elapsedTime = 0;
    score = 0;
    planets = [];
    generatePlanets(numPlanets);

    spaceship = new Spaceship(canvas.width / 2, canvas.height / 2, 15, 100);
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        spaceship.thrust = 300; // Adjust this value to control the strength of the thrusters
        spaceship.showFlame = true;
    } else if (event.key === 'ArrowDown') {
        spaceship.thrust = -300; // Adjust this value to control the strength of the thrusters
    } else if (event.key === 'ArrowLeft') {
        spaceship.turnSpeed = -2; // Adjust this value to control the turn speed (in radians)
    } else if (event.key === 'ArrowRight') {
        spaceship.turnSpeed = 2; // Adjust this value to control the turn speed (in radians)
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        restartGame();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        spaceship.thrust = 0;
                    spaceship.showFlame = false;

    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        spaceship.turnSpeed = 0;
    }
});
document.body.appendChild(gasButton);
document.body.appendChild(brakeButton);

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault();

  const touch = event.touches[0];
  const targetX = touch.clientX - canvas.offsetLeft;
  const targetY = touch.clientY - canvas.offsetTop;
  const deltaX = targetX - spaceship.x;
  const deltaY = targetY - spaceship.y;

  // Calculate the angle to turn towards the touch point
  const angle = Math.atan2(deltaY, deltaX);
  spaceship.angle = angle;
});


// Touch event for the gas button
gasButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  spaceship.thrust = 50; // Adjust thrust value as needed
});

gasButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  spaceship.thrust = 0;
});

// Touch event for the brake button
brakeButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  spaceship.thrust = -20; // Adjust braking value as needed (negative for braking)
});

brakeButton.addEventListener('touchend', (event) => {
  event.preventDefault();
  spaceship.thrust = 0;
});

function resizeCanvas() {
  leftstart = window.innerWidth/2 - 600 + 20;
  bottomstart = window.innerHeight/2 -350 + 40;

  // Position the gas button
  gasButton.style.left = `${leftstart}px` ;
  gasButton.style.bottom = `${bottomstart+60}px` ;

  // Position the brake button
  brakeButton.style.left = `${leftstart}px` ;
  brakeButton.style.bottom = `${bottomstart}px` ;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lastTime = 0;
requestAnimationFrame(gameLoop);
