// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .2
  let rows = (window.outerHeight * .80) / pixelSize;
  let cols = (window.outerWidth * .95) / pixelSize;
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
  let startStopBut = document.getElementById('start-stop')
  let container = document.getElementById('container');
  container.append(sim.canvas);

  let diagonalLength = Math.sqrt((rows * rows) + (cols * cols)); //rows^2 + cols^2
  let hueIncrement = 360 / diagonalLength;
  // console.log(diagonalLength, hueIncrement, hueIncrement * Math.sqrt((rows * rows) + (cols * cols)));
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
      sim.grid[i][j].lifeStyle = `hsl(${h}, 100%, 60%)`;
      // console.log(sim.grid[i][j].lifeStyle);
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
