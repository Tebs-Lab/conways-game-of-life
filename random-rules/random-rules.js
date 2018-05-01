// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 150;
  let chanceOfLife = .2;
  let simRows = 4;
  let simCols = 4;
  let numberOfSims = simRows * simCols;

  let container = document.querySelector('#container');
  let containerWidth = window.innerWidth * .97;
  let containerHeight = window.innerHeight * .95;
  let cols = containerWidth / (simRows * pixelSize);
  let rows = containerHeight / (simCols * pixelSize);
  container.style.displayy = 'grid';
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';
  container.style.gridTemplateColumns = `repeat(${simCols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${simRows}, 1fr)`;

  let ruleSets = [];
  for(let underpopulation = 1; underpopulation < 4; underpopulation++) {
    for (let reproduction = 0; reproduction < 4; reproduction++) {
      for (let overpopulation = 1; overpopulation < 8; overpopulation++) {
        ruleSets.push([underpopulation, reproduction, overpopulation]);
      }
    }
  }

  for (let i = 0; i < numberOfSims; i++) {
    let [lifeStyle, deathStyle] = randomColorPair();
    let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife)
    let ruleIndex = Math.floor(Math.random() * ruleSets.length);


    sim.grid.forEach((row) => {
      row.forEach((entity) => {
        entity.lifeStyle = lifeStyle;
        entity.deathStyle = deathStyle;
        entity.update = generateUpdateFunction(...ruleSets[ruleIndex]);
      });
    });

    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();

    // Set this sim to reset it's rules occasionally!
    let waitPeriod = (Math.floor(Math.random() * 5000)) + 5000;
    setInterval(() => {
      waitPeriod = (Math.floor(Math.random() * 5000)) + 5000;
      let [lifeStyle, deathStyle] = randomColorPair();
      let rules = ruleSets[rand(0, ruleSets.length - 1)];

      sim.grid.forEach((row) => {
        row.forEach((entity) => {
          entity.alive = Math.random() > chanceOfLife;
          entity.lifeStyle = lifeStyle;
          entity.deathStyle = deathStyle;
          entity.update = generateUpdateFunction(...rules);
        });
      });
    }, waitPeriod);
  }
});
