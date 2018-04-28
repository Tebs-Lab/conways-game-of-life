// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 12;
  let roundDelay = 200;
  let chanceOfLife = .4;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .90;
  let containerHeight = window.innerHeight * .90;
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

function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function randomColorPair() {
    let h = rand(1, 360);
    let comp = (h + rand(30, 180)) % 360
    // let s = rand(0, 100);
    // let l = rand(0, 100);

    return [
      `hsl(${h}, 90%, 50%)`,
      `hsl(${comp}, 90%, 50%)`
    ]
}
