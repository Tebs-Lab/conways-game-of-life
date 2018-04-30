// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .4;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .95;
  let cols = containerWidth / (3 * pixelSize);
  let rows = containerHeight / (3 * pixelSize);
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  for (var i = 0; i < 9; i++) {
    let [lifeStyle, deathStyle] = randomColorPair();
    let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
    sim.grid.forEach((row) => {
      row.forEach((entity) => {
        entity.lifeStyle = lifeStyle;
        entity.deathStyle = deathStyle;
      });
    });
    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();
  }
});
