// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  // Data setup
  var rows = 200;
  var cols = 100;
  var chanceOfLife = .01;
  var interRoundDelayMS = 200;
  var pixelSize = 12;

  let grid = generateGrid(rows, cols, chanceOfLife);
  let canvas = document.createElement('canvas');
  let canvasCtx = canvas.getContext('2d');

  // Canvas setup
  let width = pixelSize * rows
  let height = pixelSize * cols
  canvas.width = width;
  canvas.height = height;
  document.body.append(canvas);
  paintGrid(grid, canvasCtx, pixelSize);

  setInterval(() => {
    updateGrid(grid);
    paintGrid(grid, canvasCtx, pixelSize);
  }, interRoundDelayMS);
});

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
  let deathStyle = '#ADD8E6';
  let lifeStyle = '#000000';

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
      canvasCtx.fillStyle = grid[i][j] ? lifeStyle : deathStyle;
      canvasCtx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
    }
  }
}
