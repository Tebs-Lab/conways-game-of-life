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
    rainbowMode,
    randomColors,
    autoRefresh
  } = searchObj;

  // Defaults
  pixelSize = parseInt(pixelSize, 10) || 12;
  roundDelay = parseInt(roundDelay, 10) || 200;
  simRows = parseInt(simRows, 10) || 4;
  simCols = parseInt(simCols, 10) || 4;
  randomRules = randomRules === "on";
  rainbowMode = rainbowMode === "on";
  randomColors = randomColors === "on";
  autoRefresh = autoRefresh === "on";
  if(isNaN(parseFloat(chanceOfLife))) {
    chanceOfLife = .1;
  }
  else {
    chanceOfLife = parseFloat(chanceOfLife);
  }

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
  container.style.display = `grid`;

  const RULE_SETS = generateRuleSets();

  for (let i = 0; i < numberOfSims; i++) {
    let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife)
    refreshSim(sim, chanceOfLife);

    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();

    if(autoRefresh) {
      setInterval(refreshSim.bind(null, sim, chanceOfLife), 5000 + (Math.random() * 5000));
    }
  }

  function refreshSim(sim, chanceOfLife) {
    let ruleIndex = Math.floor(Math.random() * RULE_SETS.length);
    sim.resetLife(chanceOfLife);

    if(randomRules) {
      sim.setRules(...RULE_SETS[ruleIndex]);
    }

    if(randomColors || rainbowMode) {
      if(Math.random() < .01 || rainbowMode) {
        sim.setRainbowScheme();
      } else {
        sim.setRandomPixelColors();
      }
    }
  }
});
