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
  chanceOfLife = parseFloat(chanceOfLife) || .1;
  simRows = parseInt(simRows, 10) || 4;
  simCols = parseInt(simCols, 10) || 4;
  randomRules = randomRules === "on";
  randomColors = randomColors === "on";
  autoRefresh = autoRefresh || false;

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

/*
  Random generation of many rulesets...
*/
function generateRuleSets() {
  let ruleSets = [];
  for(let underpopulation = 0; underpopulation < 9; underpopulation++) {
    for (let reproductionMax = 0; reproductionMax < 9; reproductionMax++) {
      for (let reproductionMin = 0; reproductionMin < 9; reproductionMin++) {
        for (let overpopulation = 0; overpopulation < 9; overpopulation++) {
          ruleSets.push([underpopulation, overpopulation, reproductionMin, reproductionMax]);
        }
      }
    }
  }

  return ruleSets;
}

/*
  Random bounded integer.
*/
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

/*
  Return an Array with two relatively complementary colors.
*/
function randomColorPair() {
  let h = rand(1, 360);
  let comp = (h + rand(90, 270) % 360)

  return [
    `hsl(${h}, 100%, 60%)`,
    `hsl(${comp}, 100%, 60%)`
  ]
}

/*
  generate an update function with the provided thresholds for "Conway's Rules"
  for a SimulationEntity.
*/
function generateUpdateFunction(underpopulation, overpopulation, reproductionMin, reproductionMax) {
  return function randomUpdate(neighbors) {
    let sum = 0;
    let alive = this.alive;
    if(reproductionMax === undefined || reproductionMax < reproductionMin) {
      reproductionMax = reproductionMin;
    }

    for(let n of neighbors){
      if(n.alive && n !== this) sum++;
    }


    if(alive && sum < underpopulation){
      alive = false;
    }
    else if(alive && sum > overpopulation) {
      alive = false;
    }
    else if(!alive && sum >= reproductionMin && sum <= reproductionMax) {
      alive = true;
    }

    return new SimEntity(alive, this.lifeStyle, this.deathStyle, randomUpdate);
  }
}
