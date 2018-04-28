// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 10;
  let roundDelay = 100;
  let chanceOfLife = .2
  let rows = (window.outerHeight * .80) / pixelSize;
  let cols = (window.outerWidth * .95) / pixelSize;
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
  let startStopBut = document.getElementById('start-stop')
  let container = document.getElementById('container');
  container.append(sim.canvas);

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
