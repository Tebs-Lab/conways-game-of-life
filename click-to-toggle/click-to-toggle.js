// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 12;
  let roundDelay = 100;
  let chanceOfLife = .1;
  let simRows = 1;
  let simCols = 1;
  let numberOfSims = simRows * simCols;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .90;
  let containerHeight = window.innerHeight * .90;
  let cols = containerWidth / (simRows * pixelSize);
  let rows = containerHeight / (simCols * pixelSize);
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

  let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  let startingRules = ruleSets[ruleIndex];
  let startingUpdate = generateUpdateFunction(...startingRules);
  let rulesForm = document.querySelector('#sim-parameters');
  rulesForm.querySelector('#underpopulation').value = startingRules[0];
  rulesForm.querySelector('#reproduction').value = startingRules[1];
  rulesForm.querySelector('#overpopulation').value = startingRules[2];
  rulesForm.addEventListener('submit' , (e) => { e.preventDefault(); });

  let allSims = [];
  document.querySelector('#update-rules-button').addEventListener('click', (e) => {
    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10)
    ];

    for(let sim of allSims) {
      resetRules(sim, generateUpdateFunction(...rules));
    }
  });

  document.querySelector('#random-rules-button').addEventListener('click', (e) => {
    allSims.forEach((sim) => {
      let ruleIndex = Math.floor(Math.random() * ruleSets.length);
      let rules = ruleSets[ruleIndex];
      resetRules(sim, generateUpdateFunction(...rules));

      rulesForm.querySelector('#underpopulation').value = rules[0];
      rulesForm.querySelector('#reproduction').value = rules[1];
      rulesForm.querySelector('#overpopulation').value = rules[2];
    });
  });

  let rainbow = false;
  document.querySelector('#toggle-rainbow-button').addEventListener('click', (e) => {
    if(!rainbow) {
      allSims.forEach((sim) => { setRainbowScheme(sim) });
    }
    else {
      lifeStyle = '#000000', deathStyle = '#ADD8E6'
      allSims.forEach((sim) => { resetColors(sim, lifeStyle, deathStyle) });
    }
    rainbow = !rainbow;
  });

  for (let i = 0; i < numberOfSims; i++) {
    let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife, startingUpdate);
    container.append(sim.canvas);
    sim.advanceRound();
    sim.repaint();
    sim.start();
    allSims.push(sim);
  }

});

function setRainbowScheme(sim) {
  let rows = sim.grid.length;
  let cols = sim.grid[0].length;
  let diagonalLength = Math.sqrt((rows * rows) + (cols * cols)); //rows^2 + cols^2
  let hueIncrement = 360 / diagonalLength;
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
      sim.grid[i][j].lifeStyle = `hsl(${h}, 100%, 60%)`;
    }
  }
}

function rotateSim(sim, ruleSets) {
  let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  resetRules(sim, generateUpdateFunction(...ruleSets[ruleIndex]));
}

function randomSimulation(rows, cols, pixelSize, roundDelay, chanceOfLife, ruleSets) {
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife)
  let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  resetRules(sim, generateUpdateFunction(...ruleSets[ruleIndex]));

  return sim;
}

function resetRules(sim, updateFunction) {
  sim.grid.forEach((row) => {
    row.forEach((entity) => {
      entity.update = updateFunction;
    });
  });
}

function resetColors(sim, lifeStyle, deathStyle) {
  sim.grid.forEach((row) => {
    row.forEach((entity) => {
      entity.lifeStyle = lifeStyle;
      entity.deathStyle = deathStyle;
    });
  });
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
function generateUpdateFunction(underpopulation, reproduction, survive) {
  return function randomUpdate(neighbors) {
    let sum = 0;
    let alive = this.alive;

    for(let n of neighbors){
      if(n.alive && n !== this) sum++;
    }


    if(alive && sum < underpopulation){
      alive = false;
    }
    else if(alive && sum <= survive) {
      alive = true;
    }
    else if(alive) {
      alive = false;
    }
    else if(!alive && sum === reproduction) {
      alive = true;
    }

    return new SimEntity(alive, this.lifeStyle, this.deathStyle, randomUpdate);
  }
}
