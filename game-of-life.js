// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  // Data setup
  var pixelSize = 20;
  var cols = (window.outerHeight / pixelSize) - 2;
  var rows = (window.outerWidth / pixelSize) - 2;
  var chanceOfLife = .1;
  var interRoundDelayMS = 200;

  let grid = generateGrid(rows, cols, chanceOfLife);
  let canvas = document.createElement('canvas');
  let canvasCtx = canvas.getContext('2d');

  // Canvas setup
  let width = pixelSize * cols
  let height = pixelSize * rows
  canvas.width = width;
  canvas.height = height;
  document.body.append(canvas);
  paintGrid(grid, canvasCtx, pixelSize);

  // Game State
  let mouseIsDown = false;
  let paused = true;
  let goButton = document.createElement('button')
  goButton.innerHTML = "Start Life";
  document.body.append(goButton);

  // Adding Event Handlers
  setInterval(() => {
    if(!mouseIsDown && !paused) {
      updateGrid(grid);
      paintGrid(grid, canvasCtx, pixelSize);
    }
  }, interRoundDelayMS);

  goButton.addEventListener('click', (e) => {
    paused = false;
  });

  canvas.addEventListener('mousedown', (e) => {
    setPixelAlive(e, grid, canvasCtx, pixelSize)
  });

  canvas.addEventListener('mousemove', (e) =>  {
    if(mouseIsDown) setPixelAlive(e, grid, canvasCtx, pixelSize);
  });

  // Capture mouse state for click and drag features
  window.addEventListener('mousedown', () => {
    mouseIsDown = true;
  });

  window.addEventListener('mouseup', () => {
    mouseIsDown = false;
  });
});

/**
  paint the pixel that some MouseEvent is being fired for.

  @param {MouseEvent} mouseEvent - the event being triggered
*/
function setPixelAlive(mouseEvent, grid, canvasCtx, pixelSize) {
  // Get the relative position (offset) within the canvas
  let x = Math.floor(mouseEvent.offsetX / pixelSize);
  let y = Math.floor(mouseEvent.offsetY / pixelSize);
  grid[y][x] = true;
  paintPixel(grid, canvasCtx, y, x, pixelSize);
}

function generateGrid(rows, cols, chanceOfLife = .1) {
  let grid = [];
  for(let i = 0; i < rows; i++) {
    let row = [];
    grid.push(row);
    for(let j = 0; j < rows; j++) {
       row.push(Math.random() < chanceOfLife)
    }
  }

  return grid;
}

/*
  Rules Of Life:

  Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  Any live cell with two or three live neighbours lives on to the next generation.
  Any live cell with more than three live neighbours dies, as if by overpopulation.
  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

*/
function updateGrid(grid) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      updateSquare(grid, i, j);
    }
  }
}


function updateSquare(grid, row, col) {
  let neighbours = 0;
  for(let i = row - 1; i <= row + 1; i++) {
    for(let j = col - 1; j <= col + 1; j++) {
      if(i === row && j === col) continue;
      if(grid[i] && grid[i][j]) {
          neighbours++;
      }
    }
  }

  let alive = grid[row][col];
  if(neighbours < 2 && alive) { grid[row][col] = false }
  else if(neighbours <= 3 && alive) { grid[row][col] = true }
  else if(neighbours > 3 && alive) { grid[row][col] = false }
  else if(neighbours == 3 && !alive) { grid[row][col] = true }
}

function paintGrid(grid, canvasCtx, pixelSize) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
      paintPixel(grid, canvasCtx, i, j, pixelSize);
    }
  }
}

function paintPixel(grid, canvasCtx, i, j, pixelSize) {
  let deathStyle = '#ADD8E6';
  let lifeStyle = '#000000';
  canvasCtx.fillStyle = grid[i][j] ? lifeStyle : deathStyle;
  canvasCtx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
}
