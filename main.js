// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  console.log('Use window.sim.start() and window.sim.stop() to start/stop the simulation');
  let pixelSize = 10;
  let roundDelay = 10;
  let chanceOfLife = .2
  let rows = (window.outerHeight / pixelSize);
  let cols = (window.outerWidth / pixelSize);
  window.sim = new Simulation(rows, cols, pixelSize, pixelSize, chanceOfLife);
  document.body.append(window.sim.canvas);
  window.sim.start();
});
