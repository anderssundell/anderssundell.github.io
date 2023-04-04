const fieldWidth = 10;
const fieldHeight = 10;
const gameContainer = document.getElementById("game-container");
const playingField = new Array(fieldHeight).fill(null).map(() => new Array(fieldWidth).fill(0));

function getLevelOfTheDay() {
  const today = new Date();
  const start = new Date("2023-03-24 23:00:01"); // Set the start date when you launched the game
  const diff = Math.floor((today - start) / (24 * 60 * 60 * 1000));
  return diff+1
}

function getDateByIndex(index) {
  const today = new Date();
  const date = new Date(today.setDate(today.getDate() - index));
  return date.toLocaleDateString();
}



let levelKey = ""

const firstFiveItems = window.originallevels.slice(0, getLevelOfTheDay()); // Select the first X items
window.levels = firstFiveItems.reverse(); // Reverse the order of the selected items

let currentLevelSet = "levels"; // Default to the "levels" set 

let playerObject = [
  { x: 0, y: 0, type: 1 }
];

let moveCount = 0;
let remainingCollectables = 0;

let currentLevel = 0;

// Add a variable to keep track of the current level
let antiPlayerObjects = [];
let vantiPlayerObjects = [];



// Helper function to create a tile element
function createTileElement(type) {
  const tile = document.createElement("div");
  tile.classList.add("tile");

  if (type === 0) {
    tile.classList.add("empty");
  } else if (type === 1) {
    tile.classList.add("player");
  } else if (type === 2) {
    tile.classList.add("collectable");
  } else if (type === 3) {
    tile.classList.add("obstacle");
  } else if (type === 4) {
    tile.classList.add("teleport_origin");
  } else if (type === 8) {
    tile.classList.add("vantiplayer");
  } else if (type === 9) {
    tile.classList.add("antiplayer");
  }
  return tile;
}

let inputFrozen = false;

function freezeInput(duration) {
  inputFrozen = true;
  setTimeout(() => {
    inputFrozen = false;
  }, duration);
}

// Function to render the playing field
function renderPlayingField() {
  gameContainer.innerHTML = "";

  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      const tile = createTileElement(playingField[y][x]);
      gameContainer.appendChild(tile);
    }
  }
}

// Count remaining collectibles
function howMany() {
  remainingCollectables = 0; // Reset the remainingCollectables count

  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      // Update the playerObject array based on the level data
      if (playingField[y][x] === 2) {
        remainingCollectables++; // Increment the remainingCollectables count
      }
    }
  }
}


// Function to load a level
function loadLevel(level) {
  playerObject = []; // Reset the playerObject array

 antiPlayerObjects = [];
  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      if (level[y][x] === 9) {
        antiPlayerObjects.push({ x, y, type: 9});
      }
    }
  }

   vantiPlayerObjects = [];
  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      if (level[y][x] === 8) {
        vantiPlayerObjects.push({ x, y, type: 8});
      }
    }
  }




  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      playingField[y][x] = level[y][x];

      // Update the playerObject array based on the level data
      if (level[y][x] === 1) {
        playerObject.push({ x, y, type: 1 });
      }
    }
  }

  renderPlayingField();
  howMany();
        moveCount = 0;
  updateGameInfo(); // Update the game info

  // Draw star
levelKey = currentLevelSet + "-" + getDateByIndex(currentLevel);

if (currentLevelSet === "tutorials" ) {
   levelKey = currentLevelSet + "-" + currentLevel;
  
  }

    const cleared = JSON.parse(localStorage.getItem(levelKey)) || false;

  // Create a separate canvas for the star
  const starContainer = document.getElementById("star-container");
  starContainer.innerHTML = ""; // Clear the previous star, if any
  const starCanvas = document.createElement("canvas");
  starCanvas.width = 20; // Set an appropriate width for the star canvas
  starCanvas.height = 20; // Set an appropriate height for the star canvas
  starContainer.appendChild(starCanvas);
  const starCtx = starCanvas.getContext("2d");

  // Draw the star
  const starX = starCanvas.width / 2;
  const starY = starCanvas.height / 2;
  const starRadius = 10;
  drawStar(starCtx, starX, starY, starRadius, cleared);

}


// Teleportation tiles
function findDestinationTeleportTile(level, currentTeleport) {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === 4 && (y !== currentTeleport.y || x !== currentTeleport.x)) {
        return { x, y };
      }
    }
  }
  return null;
}


// Function to handle player movement
function movePlayer(dx, dy) {
  const newPlayerObject = playerObject.map(({ x, y, type }) => ({ x: x + dx, y: y + dy, type }));

  moveCount++;



  // Check for collisions with walls, obstacles, or itself
  for (const newPos of newPlayerObject) {
    const { x, y } = newPos;
    if (
      x < 0 || x >= fieldWidth || y < 0 || y >= fieldHeight ||
      playingField[y][x] === 3 //|| // Obstacle
    ) {
      return;
    }
  }




     // Move the anti-player objects
  for (const antiPlayer of antiPlayerObjects) {
    const newX = antiPlayer.x - dx;
    const newY = antiPlayer.y + dy;

    // Check for collisions with walls or obstacles, and only move the anti-player object if there's no collision
    if (
      newX >= 0 && newX < fieldWidth &&
      newY >= 0 && newY < fieldHeight &&
      playingField[newY][newX] !== 3 &&
      playingField[newY][newX] !== 4 &&
      playingField[newY][newX] !== 8 &&
      playingField[newY][newX] !== 9 &&
      playingField[newY][newX] !== 2 // Obstacle
    ) {
      playingField[antiPlayer.y][antiPlayer.x] = 0; // Clear the previous position
      playingField[newY][newX] = 9; // Set the new position
      antiPlayer.x = newX;
      antiPlayer.y = newY;
    }

  }

       // Move the vanti-player objects
  for (const vantiPlayer of vantiPlayerObjects) {
    const newX = vantiPlayer.x + dx;
    const newY = vantiPlayer.y - dy;

    // Check for collisions with walls or obstacles, and only move the anti-player object if there's no collision
    if (
      newX >= 0 && newX < fieldWidth &&
      newY >= 0 && newY < fieldHeight &&
      playingField[newY][newX] !== 3 &&
      playingField[newY][newX] !== 4 &&
      playingField[newY][newX] !== 8 &&
      playingField[newY][newX] !== 9 &&
      playingField[newY][newX] !== 2 // Obstacle
    ) {
      playingField[vantiPlayer.y][vantiPlayer.x] = 0; // Clear the previous position
      playingField[newY][newX] = 8; // Set the new position
      vantiPlayer.x = newX;
      vantiPlayer.y = newY;
    }

  }



// Handle teleportation for each player object
  newPlayerObject.forEach((player, index) => {
    if (playingField[player.y][player.x] === 4) {
      const currentTeleport = { x: player.x, y: player.y };
      const destinationTeleport = findDestinationTeleportTile(playingField, currentTeleport);

      if (destinationTeleport) {
        player.x = destinationTeleport.x+dx;
        player.y = destinationTeleport.y+dy;
        newPlayerObject[index] = player;
      }
    }
  });


  // Move the player object
  playerObject.forEach(({ x, y }) => {
    playingField[y][x] = 0;
  });



  playerObject = newPlayerObject;


// Check for collectable pieces in neighboring squares
  const collectableOffsets = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ];


 // Check for collision with anti-player tile
  for (const { x, y } of newPlayerObject) {
    for (const { dx, dy } of collectableOffsets) {
      const collectableX = x + dx;
      const collectableY = y + dy;
      if (
        collectableX >= 0 && collectableX < fieldWidth &&
        collectableY >= 0 && collectableY < fieldHeight &&
        playingField[collectableY][collectableX] === 9
      ) {
          // Transform the player object
            playerObject = playerObject.map(obj => ({ x: obj.x, y: obj.y, type: 9 }));
    playerObject.forEach(({ x, y }) => {
      playingField[y][x] = 9;
      freezeInput(500);
      setTimeout(() => {
        loadLevel(window[currentLevelSet][currentLevel]);
      }, 500);
    });

      }
    }
  }

   // Check for collision with vanti-player tile
  for (const { x, y } of newPlayerObject) {
    for (const { dx, dy } of collectableOffsets) {
      const collectableX = x + dx;
      const collectableY = y + dy;
      if (
        collectableX >= 0 && collectableX < fieldWidth &&
        collectableY >= 0 && collectableY < fieldHeight &&
        playingField[collectableY][collectableX] === 8
      ) {
          // Transform the player object
            playerObject = playerObject.map(obj => ({ x: obj.x, y: obj.y, type: 8 }));
    playerObject.forEach(({ x, y }) => {
      playingField[y][x] = 8;
      freezeInput(500);
      setTimeout(() => {
        loadLevel(window[currentLevelSet][currentLevel]);
      }, 500);
    });

      }
    }
  }


  // Add neighboring pieces
  for (const { x, y } of newPlayerObject) {
    for (const { dx, dy } of collectableOffsets) {
      const collectableX = x + dx;
      const collectableY = y + dy;
      if (
        collectableX >= 0 && collectableX < fieldWidth &&
        collectableY >= 0 && collectableY < fieldHeight &&
        playingField[collectableY][collectableX] === 2
      ) {
        playerObject.push({ x: collectableX, y: collectableY , type: 1 });
        playingField[collectableY][collectableX] = 1;

        //remainingCollectables--; // Decrement the remainingCollectables count

        howMany();
        updateGameInfo();
       
            if (remainingCollectables===0) {
                setTimeout(() => {
                nextLevel();
                }, 500); // Wait 0.5 second before loading the next level
              }
      }
    }
  }

   // const newPlayerObject = playerObject.map(({ x, y, type }) => ({ x: collectableX, y: collectableY, type }));

  //playerObject = newPlayerObject;



  playerObject.forEach(({ x, y, type }) => {
    playingField[y][x] = type;
  });

 for (const antiPlayer of antiPlayerObjects) {

if (playingField[antiPlayer.y][antiPlayer.x] === 1 ) {
        playingField[antiPlayer.y][antiPlayer.x] = 9;
  freezeInput(500);
   setTimeout(() => {
     loadLevel(window[currentLevelSet][currentLevel]);
   }, 500);
}
}

 for (const vantiPlayer of vantiPlayerObjects) {

if (playingField[vantiPlayer.y][vantiPlayer.x] === 1 ) {
        playingField[vantiPlayer.y][vantiPlayer.x] = 8;
  freezeInput(500);
   setTimeout(() => {
     loadLevel(window[currentLevelSet][currentLevel]);
   }, 500);
}
}


  renderPlayingField();
  updateGameInfo();



}

function updateGameInfo() {
let levelheader = "";
let levelnumber = getDateByIndex(currentLevel); //The getbydateindex takes the number of days before today

if (currentLevelSet === "tutorials" ) {
levelheader = "Tutorial";
levelnumber = currentLevel + 1;
}



  const gameInfo = document.getElementById("game-info");
  gameInfo.innerHTML = `<span> ${levelheader} ${levelnumber} | Moves: ${moveCount}</span>
  `;
}


// Event listener for arrow keys
document.addEventListener("keydown", (event) => {
    if (inputFrozen) return; // Ignore input if input is frozen
  if (event.key === "ArrowUp") {
    movePlayer(0, -1);
  } else if (event.key === "ArrowDown") {
    movePlayer(0, 1);
  } else if (event.key === "ArrowLeft") {
    movePlayer(-1, 0);
  } else if (event.key === "ArrowRight") {
    movePlayer(1, 0);
  }
});

// Event listener for reload button
document.getElementById("reload-level").addEventListener("click", () => {
  loadLevel(window[currentLevelSet][currentLevel]);
});

function nextLevel() {
levelKey = currentLevelSet + "-" + getDateByIndex(currentLevel);

if (currentLevelSet === "tutorials" ) {
   levelKey = currentLevelSet + "-" + currentLevel;
  
  }

  localStorage.setItem(levelKey, "true");

  currentLevel++;
  if (currentLevel < window[currentLevelSet].length) {
    moveCount = 0;
    loadLevel(window[currentLevelSet][currentLevel]);
  } else {
    // All levels are completed, you can show a message or restart the game.
    currentLevel = 0;
    loadLevel(window[currentLevelSet][currentLevel]);
  }
}

// Event listener for mobile arrow keys
// Add event listeners for virtual arrow keys
document.getElementById("arrow-up").addEventListener("touchstart", () => {
  movePlayer(0, -1);
});
document.getElementById("arrow-left").addEventListener("touchstart", () => {
  movePlayer(-1, 0);
});
document.getElementById("arrow-down").addEventListener("touchstart", () => {
  movePlayer(0, 1);
});
document.getElementById("arrow-right").addEventListener("touchstart", () => {
  movePlayer(1, 0);
});

 //Add event listeners to prevent default touch behavior on the virtual arrow keys
const arrowKeys = document.querySelectorAll(".virtual-keys button");
arrowKeys.forEach((key) => {
  key.addEventListener("touchstart", (event) => {
    event.preventDefault();
  });
});

document.addEventListener('DOMContentLoaded', () => {
      const dropdown = document.getElementById('level-select');
    const start = 1;
    const end = getLevelOfTheDay();

    const dropdown_t = document.getElementById('level-select-tutorial');
    const start_t = 1;
    const end_t = 10;

    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = getDateByIndex(i-1);
        dropdown.appendChild(option);
        }

    for (let i = start_t; i <= end_t; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dropdown_t.appendChild(option);
    }
  }
);


document.getElementById('level-select').addEventListener('change', function (event) {
    currentLevelSet = "levels";
  const selectedLevel = event.target.value;
  currentLevel = selectedLevel - 1;
  loadLevel(window[currentLevelSet][selectedLevel - 1]);
});

document.getElementById('level-select-tutorial').addEventListener('change', function (event) {
    currentLevelSet = "tutorials";
  const selectedLevel_t = event.target.value;
  currentLevel = selectedLevel_t - 1;
  loadLevel(window[currentLevelSet][selectedLevel_t-1]);
});

//loadDailyLevel();


function drawStar(ctx, x, y, radius, isSolid) {
  const starPoints = 5;
  const outerRadius = radius;
  const innerRadius = radius / 2;

  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);
  for (let i = 1; i < starPoints * 2; i++) {
    const angle = (Math.PI * i) / starPoints;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const newX = x + Math.sin(angle) * radius;
    const newY = y - Math.cos(angle) * radius;
    ctx.lineTo(newX, newY);
  }
  ctx.closePath();

  if (isSolid) {
    ctx.fillStyle = "#FFD700";
    ctx.fill();
  } else {
    ctx.strokeStyle = "#FFD700";
    ctx.stroke();
  }
}


loadLevel(window.levels[currentLevel]);




