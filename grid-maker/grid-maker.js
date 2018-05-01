// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  // COPYPASTA:
  var search = location.search.substring(1);
  let searchObj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
  let {
    pixelSize,
    roundDelay,
    chanceOfLife,
    simRows,
    simCols,
    randomRules,
    randomColors,
    autoRefresh
  } = searchObj;

  // Defaults
  pixelSize = parseInt(pixelSize, 10) || 12;
  roundDelay = parseInt(roundDelay, 10) || 200;
  simRows = parseInt(simRows, 10) || 4;
  simCols = parseInt(simCols, 10) || 4;
  randomRules = randomRules === "on";
  randomColors = randomColors === "on";
  autoRefresh = autoRefresh || false;
  if(isNaN(parseFloat(chanceOfLife))) {
    chanceOfLife = .1;
  }
  else {
    chanceOfLife = parseFloat(chanceOfLife);
  }
  debugger;

  let numberOfSims = simRows * simCols;
  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .90;
  let containerHeight = window.innerHeight * .90;
  let cols = containerWidth / (simCols * pixelSize);
  let rows = containerHeight / (simRows * pixelSize);
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';
  container.style.gridTemplateColumns = `repeat(${simCols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${simRows}, 1fr)`;

  let ruleSets = generateRuleSets();

  for (let i = 0; i < numberOfSims; i++) {
    let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife)
    refreshSim(sim);

    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();

    if(autoRefresh) {
      setInterval(refreshSim.bind(null, sim), 5000 + (Math.random() * 5000));
    }
  }

  function refreshSim(sim) {
    let ruleIndex = Math.floor(Math.random() * ruleSets.length);
    let [lifeStyle, deathStyle] = randomColorPair();

    sim.grid.forEach((row) => {
      row.forEach((entity) => {
        if(randomColors) {
          entity.lifeStyle = lifeStyle;
          entity.deathStyle = deathStyle;
        }
        if (randomRules) {
          entity.update = generateUpdateFunction(...ruleSets[ruleIndex]);
        }
      });
    });
  }
});
