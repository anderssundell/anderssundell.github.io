const fieldWidth = 10;
const fieldHeight = 10;
const gameContainer = document.getElementById("game-container");
const playingField = new Array(fieldHeight).fill(null).map(() => new Array(fieldWidth).fill(0));

let playerObject = [
  { x: 0, y: 0, type: 1 }
];

let moveCount = 0;
let remainingCollectables = 0;

const level1 = [
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 0, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level2 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 3, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level3 = [
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 2],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 3, 3, 3, 3, 3],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0, 2, 0]
];

const level4 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 3, 3, 2, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 3, 3, 3, 2, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level5 = [
  [2, 3, 0, 0, 0, 0, 0, 0, 2, 3],
  [0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 3, 3],
  [2, 0, 3, 0, 0, 0, 0, 0, 0, 2]
];

const level6 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 2, 3, 3, 3, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 3, 0, 0, 0],
  [0, 0, 3, 2, 3, 0, 3, 0, 3, 3],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


const level7 = [
  [1, 0, 0, 0, 0, 0, 3, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 3, 0, 3, 0],
  [0, 2, 0, 2, 0, 0, 3, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 3, 0],
  [0, 2, 0, 2, 0, 0, 3, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level8 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 0, 0, 0, 0, 0, 2, 0, 3, 0],
  [0, 3, 3, 3, 3, 3, 3, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
];

const level9 = [
  [1, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 2]
];

const level10 = [
  [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 3, 0, 0, 2, 0],
  [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 3, 0, 0, 0, 2, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0]
];

const level11 = [
  [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 3, 0, 0, 2, 0],
  [0, 0, 2, 0, 0, 3, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 3, 0, 0, 2, 0, 0],
  [0, 2, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0]
];

const level12 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 2, 0],
  [0, 0, 2, 0, 0, 3, 0, 2, 0, 0],
  [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
  [0, 3, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 2, 0, 0],
  [0, 2, 0, 0, 3, 0, 0, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level13 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 1, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level14 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 3, 0, 0, 0, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 3, 0],
  [0, 0, 2, 0, 3, 0, 0, 0, 3, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0, 0]
];


const level15 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0],
  [0, 0, 0, 3, 0, 3, 0, 3, 0, 0],
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level16 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


const level17 = [
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 4, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 0, 3, 0, 0, 0, 4, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 3, 0, 0, 0, 0, 0, 0]
];

const level18 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 4, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 3, 0, 0, 0, 0, 4, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 0]
];

const level19 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 3, 0, 0, 0, 0, 0, 0, 3, 3],
  [2, 2, 2, 3, 0, 0, 3, 2, 2, 2]
];

const level20 = [
  [0, 1, 0, 0, 2, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
];

const level21 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [0, 2, 0, 0, 2, 2, 0, 0, 2, 0 ],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [0, 2, 0, 0, 3, 3, 0, 0, 2, 0 ],
  [0, 2, 0, 0, 3, 3, 0, 0, 2, 0 ],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [0, 2, 0, 0, 2, 2, 0, 0, 2, 0 ],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level22 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 2], 
  [0, 3, 3, 3, 0, 0, 3, 0, 0, 0], 
  [0, 0, 0, 3, 0, 0, 3, 3, 3, 0], 
  [2, 0, 0, 3, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level23 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 3, 0, 0, 3, 0, 0, 3, 0, 0], 
  [0, 0, 2, 0, 0, 0, 2, 0, 0, 0], 
  [0, 3, 0, 3, 0, 3, 0, 3, 0, 0], 
  [0, 3, 0, 3, 2, 3, 0, 3, 0, 0], 
  [0, 3, 2, 3, 0, 3, 2, 3, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const level24 = [
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0], 
  [3, 3, 3, 0, 0, 0, 0, 0, 3, 3], 
  [3, 2, 3, 0, 0, 0, 0, 0, 3, 0], 
  [3, 0, 3, 2, 0, 0, 0, 0, 3, 4], 
  [3, 4, 3, 0, 0, 0, 0, 0, 3, 0], 
  [3, 3, 3, 0, 0, 0, 0, 0, 3, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 2, 0, 0, 0, 0, 0, 2, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]


const level25 = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0], 
  [0, 2, 0, 2, 0, 2, 0, 4, 0, 0], 
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0], 
  [0, 2, 0, 2, 0, 2, 3, 2, 0, 0], 
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0], 
  [0, 2, 0, 2, 3, 2, 0, 2, 0, 0], 
  [0, 0, 4, 0, 2, 0, 2, 0, 2, 0], 
  [0, 2, 0, 2, 0, 2, 0, 2, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]


// Add a variable to keep track of the current level
let currentLevel = 0;

// Create an array of levels
const levels = [level1, level2, level3, level4, level5, level6,
                level7, level8, level9, level10, level11, level12,
                level13, level14, level15, level16, level17, level18, level19,
                level20, level21, level22, level23, level24, level25];


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
  }
  return tile;
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



// Function to find the player position
//function findPlayerPosition() {
//  return playerObject[0];
//}

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
      //(playingField[y][x] !== 2 && playerObject.some(p => p.x === x && p.y === y)) // Player object itself
    ) {
      return;
    }
  }


  // Handle teleportation old version
  //const head = newPlayerObject[0];
  //if (playingField[head.y][head.x] === 4) {
  //  const currentTeleport = { x: head.x, y: head.y };
  //  const destinationTeleport = findDestinationTeleportTile(playingField, currentTeleport);
//
  //  if (destinationTeleport) {
  //    head.x = destinationTeleport.x + dx;
  //    head.y = destinationTeleport.y + dy;
  //    newPlayerObject[0] = head;
  //  }
  //}

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



  renderPlayingField();
  updateGameInfo();




}

function updateGameInfo() {
  const gameInfo = document.getElementById("game-info");
  gameInfo.innerHTML = `
    <p>Level ${currentLevel+1} | Moves: ${moveCount}</p>
  `;
}


// Event listener for arrow keys
document.addEventListener("keydown", (event) => {
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
  loadLevel(levels[currentLevel]);
});

function nextLevel() {
  currentLevel++;
  if (currentLevel < levels.length) {
    moveCount = 0;
    loadLevel(levels[currentLevel]);
  } else {
    // All levels are completed, you can show a message or restart the game.
    alert("Congratulations! You've completed all levels.");
    currentLevel = 0;
    loadLevel(levels[currentLevel]);
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
    const end = 25;

    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dropdown.appendChild(option);
    }
});


document.getElementById('level-select').addEventListener('change', function (event) {
  //const selectedLevel = parseInt(event.target.value, 10);
  const selectedLevel = event.target.value;
  currentLevel = selectedLevel - 1;
  loadLevel(levels[selectedLevel - 1]);
});




loadLevel(levels[currentLevel]);
