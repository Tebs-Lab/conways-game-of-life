// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 4;
  let roundDelay = 50;
  let chanceOfLife = .2

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .98;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = createOceanSim(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);
  sim.setRainbowScheme();

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
