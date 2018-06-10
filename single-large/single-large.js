// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 10;
  let roundDelay = 100;
  let chanceOfLife = .1

  let container = document.body;
  let containerWidth = window.innerWidth * .99;
  let containerHeight = window.innerHeight * .90;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.prepend(sim.canvas);
  sim.start();

  let startStopBut = document.getElementById('start-stop');
  ['click', 'touch'].map((eventName) => {
    startStopBut.addEventListener(eventName, () => {
      if(sim.intervalId) {
        sim.stop();
      }
      else {
        sim.start();
      }
    });
  });
});
