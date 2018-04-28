// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .2

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .80;
  let containerHeight = window.innerHeight * .95;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);

  let diagonalLength = Math.sqrt((rows * rows) + (cols * cols)); //rows^2 + cols^2
  let hueIncrement = 360 / diagonalLength;
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
      sim.grid[i][j].lifeStyle = `hsl(${h}, 100%, 60%)`;
    }
  }

  sim.start();
  startStopBut.addEventListener('click', () => {
    if(sim.intervalId) {
      sim.stop();
    }
    else {
      sim.start();
    }
  });
});
