// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .2

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth;
  let containerHeight = window.innerHeight;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = createOceanSim(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);
  setRainbowScheme(sim);

  sim.start();
  window.addEventListener('keydown', (e) => {
    if(sim.intervalId && e.which === 90) {
      sim.stop();
    }
    else {
      sim.start();
    }
  });
});
