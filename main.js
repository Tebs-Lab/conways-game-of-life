// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 10;
  let roundDelay = 100;
  let chanceOfLife = .2
  let rows = (window.outerHeight * .75) / pixelSize;
  let cols = (window.outerWidth * .75) / pixelSize;
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
  let startStopBut = document.createElement('button');
  startStopBut.innerHTML = 'Start/Stop';
  document.body.append(startStopBut);
  document.body.append(sim.canvas);

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
