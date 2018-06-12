// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 50;
  let chanceOfLife = .2

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .99;
  let containerHeight = window.innerHeight * .99;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = createWildOceanSim(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);

  let diagonalLength = Math.sqrt((rows * rows) + (cols * cols)); //rows^2 + cols^2
  let hueIncrement = 360 / diagonalLength;
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
      sim.grid[i][j].lifeStyle = `hsl(${h}, 100%, 60%)`;
      sim.grid[i][j].deathStyle = '#000000';
    }
  }

  sim.start();
  window.addEventListener('keydown', (e) => {
    if(sim.intervalId && e.which === 90) {
      sim.stop();
    }
    else if(e.which === 90){
      sim.start();
    }
  });
});
