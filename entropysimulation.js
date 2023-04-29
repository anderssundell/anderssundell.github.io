const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 100;
const cellSize = canvas.width / gridSize;
const transferRate = 0.5;
const stepsPerFrame = 1;


let isMouseDown = false;
let isSpaceBarPressed = false;




function randomGrid() {
  const grid = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    grid[i] = new Array(gridSize);
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = Math.random();
    }
  }
  return grid;
}

function transferHeat(grid, i, j, ni, nj) {
  if (grid[i][j] === -1 || grid[ni][nj] === -1) {
    return;
  }
  const delta = (grid[i][j] - grid[ni][nj]) * transferRate;
  grid[i][j] -= delta;
  grid[ni][nj] += delta;
}

function step(grid) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === -1) {
        continue;
      }
      
      const neighbors = [
        [i - 1, j],
        [i + 1, j],
        [i, j - 1],
        [i, j + 1],
      ];
      for (const [ni, nj] of neighbors) {
        if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize && grid[i][j] > grid[ni][nj]) {
          transferHeat(grid, i, j, ni, nj);
        }
      }
    }
  }
}















function getColor(value) {
  let r, g, b;
    r = Math.floor(255 * value);
    g = 0;
    b = 255-Math.floor(255 * value);

  // Ensure the RGB values are within the valid range [0, 255]
  r = Math.max(0, Math.min(255, r));
  b = Math.max(0, Math.min(255, b));

  return `rgb(${r}, ${g}, ${b})`;
}

function draw(grid) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellValue = grid[i][j];
      const color = cellValue === -1 ? 'black' : getColor(cellValue);
      ctx.fillStyle = color;
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function mainLoop(grid) {
  for (let i = 0; i < stepsPerFrame; i++) {
    step(grid);
  }
  draw(grid);

  // Set a delay of 100 milliseconds between frames
  setTimeout(() => requestAnimationFrame(() => mainLoop(grid)), 0);
}


function increaseHeat(grid, i, j, isShiftPressed, drawWall) {
  const value = drawWall ? -1 : (isShiftPressed ? 0 : 1);
  const rowMax = grid.length - 1;
  const colMax = grid[0].length - 1;

  // Define the neighbors' relative positions
  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Update the clicked cell
  grid[j][i] = value;

  // Update the neighbors
  for (const [dx, dy] of neighbors) {
    const newRow = j + dy;
    const newCol = i + dx;

    // Check if the neighbor's position is valid
    if (newRow >= 0 && newRow <= rowMax && newCol >= 0 && newCol <= colMax) {
      grid[newRow][newCol] = value;
    }
  }
}

function getClickedCell(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const i = Math.floor(x / cellSize);
  const j = Math.floor(y / cellSize);
  return [i, j];
}


document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    isSpaceBarPressed = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    isSpaceBarPressed = false;
  }
});


canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const [i, j] = getClickedCell(event);
  increaseHeat(grid, j, i, event.shiftKey, isSpaceBarPressed);
  draw(grid);
});

canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const [i, j] = getClickedCell(event);
    increaseHeat(grid, j, i, event.shiftKey, isSpaceBarPressed);
    draw(grid);
  }
});


canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
  isMouseDown = false;
});



const grid = randomGrid();
mainLoop(grid);
