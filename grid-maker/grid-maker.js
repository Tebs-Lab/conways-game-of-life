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
    randomColors
  } = searchObj;

  // Defaults
  pixelSize = parseInt(pixelSize, 10) || 12;
  roundDelay = parseInt(roundDelay, 10) || 200;
  chanceOfLife = parseFloat(chanceOfLife) || .1;
  simRows = parseInt(simRows, 10) || 4;
  simCols = parseInt(simCols, 10) || 4;
  randomRules = randomRules === "on";
  randomColors = randomColors === "on";

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

  let ruleSets = [];
  for(let underpopulation = 1; underpopulation < 4; underpopulation++) {
    for (let reproduction = 0; reproduction < 4; reproduction++) {
      for (let overpopulation = 1; overpopulation < 8; overpopulation++) {
        ruleSets.push([underpopulation, reproduction, overpopulation]);
      }
    }
  }

  for (let i = 0; i < numberOfSims; i++) {
    let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife)
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
