const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let keys = {};

let gameIsRunning = true;


document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

const numStars = 100;
const stars = [];

for (let i = 0; i < numStars; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  stars.push({ x, y });
}

function renderStars() {
  ctx.fillStyle = 'white';

  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}


class Spaceship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = 10;
    this.velocity = { x: 0, y: 0 };
  }

   update() {
    if (keys['ArrowUp']) {
      this.velocity.x += Math.cos(this.angle) * 0.1;
      this.velocity.y += Math.sin(this.angle) * 0.1;
    }

    if (keys['ArrowDown']) {
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
    }

    if (keys['ArrowLeft']) {
      this.angle -= 0.1;
    }

    if (keys['ArrowRight']) {
      this.angle += 0.1;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Wrap around screen edges
    this.x = (this.x + canvas.width) % canvas.width;
    this.y = (this.y + canvas.height) % canvas.height;
  }

  render() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, 7);
    ctx.lineTo(-10, -7);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
}

class Asteroid {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Wrap around screen edges
    this.x = (this.x + canvas.width) % canvas.width;
    this.y = (this.y + canvas.height) % canvas.height;
  }

  render() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class LaserBeam {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
  return false;
}
return true;
  }

  render() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(-3, -1, 6, 2);
    ctx.restore();
  }
}

function randomColor() {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
    };
    this.life = 30;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life--;
  }

  render() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const particles = [];



function spawnAsteroid() {
  const minSize = 15;
  const maxSize = 50;
  const size = Math.random() * (maxSize - minSize) + minSize;
  const x = Math.random() * (canvas.width - size * 2) + size;
  const y = Math.random() * (canvas.height - size * 2) + size;
  const color = randomColor();
  return new Asteroid(x, y, size, color);
}

const numAsteroids = 10;
const asteroids = [];

for (let i = 0; i < numAsteroids; i++) {
  asteroids.push(spawnAsteroid());
}



function checkSpaceshipAsteroidCollisions(spaceship, asteroids) {
  for (const asteroid of asteroids) {
    const dx = spaceship.x - asteroid.x;
    const dy = spaceship.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = spaceship.size / 2 + asteroid.size;

    if (distance < minDistance) {
      gameOver();
      break;
    }
  }
}

function gameOver() {
  // Set gameIsRunning to false
  gameIsRunning = false;

  // Display "Game Over" message
  const restart = confirm("Game Over. Do you want to restart?");

  // If the user confirms, reload the page
  if (restart) {
    location.reload();
  }
}




function handleAsteroidCollisions(asteroids) {
  for (let i = 0; i < asteroids.length; i++) {
    const a1 = asteroids[i];

    // Check for collisions with screen edges
    if (a1.x <= a1.size || a1.x >= canvas.width - a1.size) {
      a1.velocity.x *= -1;
    }
    if (a1.y <= a1.size || a1.y >= canvas.height - a1.size) {
      a1.velocity.y *= -1;
    }

    // Check for collisions with other asteroids
    for (let j = i + 1; j < asteroids.length; j++) {
      const a2 = asteroids[j];
      const dx = a1.x - a2.x;
      const dy = a1.y - a2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = a1.size + a2.size;

      if (distance < minDistance) {
        // Calculate collision response (bounce off)
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Rotate asteroid positions to simplify calculations
        const x1 = 0;
        const y1 = 0;
        const x2 = dx * cos + dy * sin;
        const y2 = dy * cos - dx * sin;

        // Rotate asteroid velocities
        const vx1 = a1.velocity.x * cos + a1.velocity.y * sin;
        const vy1 = a1.velocity.y * cos - a1.velocity.x * sin;
        const vx2 = a2.velocity.x * cos + a2.velocity.y * sin;
        const vy2 = a2.velocity.y * cos - a2.velocity.x * sin;

        // Calculate new velocities after collision
        const newVx1 = ((a1.size - a2.size) * vx1 + 2 * a2.size * vx2) / (a1.size + a2.size);
        const newVx2 = ((a2.size - a1.size) * vx2 + 2 * a1.size * vx1) / (a1.size + a2.size);

        // Apply new velocities
        a1.velocity.x = newVx1 * cos - vy1 * sin;
        a1.velocity.y = vy1 * cos + newVx1 * sin;
        a2.velocity.x = newVx2 * cos - vy2 * sin;
        a2.velocity.y = vy2 * cos + newVx2 * sin;

        // Move the asteroids to avoid overlap
        const overlap = minDistance - distance + 1;
        a1.x += (overlap / 2) * cos;
        a1.y += (overlap / 2) * sin;
        a2.x -= (overlap / 2) * cos;
        a2.y -= (overlap / 2) * sin;
      }
    }
  }
}


const laserBeams = [];

function spawnLaserBeam() {
  const angle = spaceship.angle;
  const offsetX = Math.cos(angle) * spaceship.size;
  const offsetY = Math.sin(angle) * spaceship.size;
  const laser = new LaserBeam(spaceship.x + offsetX, spaceship.y + offsetY, angle);
  laserBeams.push(laser);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    spawnLaserBeam();
  }
});


function checkLaserAsteroidCollisions(laserBeams, asteroids) {
  for (let i = 0; i < laserBeams.length; i++) {
    const laser = laserBeams[i];

    for (let j = 0; j < asteroids.length; j++) {
      const asteroid = asteroids[j];
      const dx = laser.x - asteroid.x;
      const dy = laser.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = asteroid.size;

      if (distance < minDistance) {
        // Split the asteroid and remove the laser beam
        splitAsteroid(asteroid);
        laserBeams.splice(i, 1);
        i--;
        break;
      }
    }
  }
}


function splitAsteroid(asteroid) {
  // Remove the asteroid from the array
  const index = asteroids.indexOf(asteroid);
  asteroids.splice(index, 1);

  // Create two smaller asteroids if the current asteroid isn't a mini asteroid
  if (asteroid.size > 10) {
    const newSize = asteroid.size / 2;
    for (let i = 0; i < 2; i++) {
      const newAsteroid = new Asteroid(asteroid.x, asteroid.y, newSize, asteroid.color);
      asteroids.push(newAsteroid);
    }
  }

    // Create particles
  for (let i = 0; i < 10; i++) {
    const particle = new Particle(asteroid.x, asteroid.y, 2);
    particles.push(particle);
  }
}






const spaceship = new Spaceship(canvas.width / 2, canvas.height / 2);


function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  if (gameIsRunning) {

    renderStars();


  // Update and render the spaceship
  spaceship.update();
  spaceship.render();

  // Update and render the asteroids
  for (const asteroid of asteroids) {
    asteroid.update();
    asteroid.render();
  }

  // Handle asteroid collisions
  handleAsteroidCollisions(asteroids);

  checkSpaceshipAsteroidCollisions(spaceship, asteroids);

  checkLaserAsteroidCollisions(laserBeams, asteroids);



 // Update and render the laser beams
for (const laser of laserBeams) {
  laser.update();
  laser.render();
}

// Update and render particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.render();

    // Remove the particle if its life has expired
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }


if (asteroids.length === 0) {
      gameIsRunning = false;
      const playAgain = confirm("Congratulations, you won! Play again?");
      if (playAgain) {
        location.reload();
      }
    }

}

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

gameLoop();
