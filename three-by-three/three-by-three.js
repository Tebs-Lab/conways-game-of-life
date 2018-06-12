// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 4;
  let roundDelay = 50;
  let chanceOfLife = .4;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .95;
  let cols = containerWidth / (3 * pixelSize);
  let rows = containerHeight / (3 * pixelSize);
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  for (var i = 0; i < 9; i++) {
    let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife);
    sim.setRandomPixelColors();
    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();
  }
});
