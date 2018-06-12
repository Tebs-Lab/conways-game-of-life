// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 4;
  let roundDelay = 100;
  let chanceOfLife = .4;
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

  let ruleSets = generateRuleSets();

  for (let i = 0; i < numberOfSims; i++) {
    let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife)
    let ruleIndex = Math.floor(Math.random() * ruleSets.length);
    sim.setRules(...ruleSets[ruleIndex])
    sim.setRandomPixelColors()

    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();

    // Set this sim to reset it's rules occasionally!
    let waitPeriod = (Math.floor(Math.random() * 5000)) + 5000;
    setInterval(() => {
      let ruleIndex = Math.floor(Math.random() * ruleSets.length);
      sim.setRules(...ruleSets[ruleIndex])
      sim.resetLife(chanceOfLife);
      sim.setRandomPixelColors()
      sim.repaint();
    }, waitPeriod);
  }
});
