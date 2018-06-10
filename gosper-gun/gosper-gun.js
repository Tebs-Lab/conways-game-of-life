// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 10;
  let chanceOfLife = 0;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .98;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);
  createGGG(sim, 1, 1);
  sim.setRainbowScheme();

  sim.start();
  window.addEventListener('keydown', (e) => {
    if(sim.intervalId && e.which === 90) {
      sim.stop();
    }
    else if(e.which === 90) {
      sim.start();
    }
  });
});
