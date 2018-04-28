// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 10;
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

  let startStopBut = document.getElementById('start-stop');
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
