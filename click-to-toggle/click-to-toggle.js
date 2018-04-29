// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .1;

  let container = document.getElementById('container');
  let canvasWidth = window.innerWidth * .78;
  let canvasHeight = window.innerHeight * .95;
  let cols = canvasWidth / pixelSize;
  let rows = canvasHeight / pixelSize;

  let ruleSets = generateRuleSets();
  // let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  let startingRules = [2, 3, 3, 3];
  let startingUpdate = generateUpdateFunction(...startingRules);
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife, startingUpdate);

  sim.canvas.style.height = canvasHeight + 'px';
  sim.canvas.style.width = canvasWidth + 'px';
  container.append(sim.canvas);
  sim.advanceRound();
  sim.repaint();
  sim.start();

  setupEventListeners(sim, ruleSets, startingRules, chanceOfLife);
});

/*
  Set all the event listeners...
*/
function setupEventListeners(sim, ruleSets, startingRules, chanceOfLife) {
  let rulesForm = document.querySelector('#sim-parameters');
  rulesForm.querySelector('#underpopulation').value = startingRules[0];
  rulesForm.querySelector('#overpopulation').value = startingRules[1];
  rulesForm.querySelector('#reproduction-min').value = startingRules[2];
  rulesForm.querySelector('#reproduction-max').value = startingRules[3];
  rulesForm.querySelector('#percent-life-reset').value = chanceOfLife;
  rulesForm.addEventListener('submit' , (e) => { e.preventDefault(); });

  // Apply the rules from the form
  document.querySelector('#update-rules-button').addEventListener('click', (e) => {
    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    ];

    updateRules(sim, generateUpdateFunction(...rules));
  });

  // Select random rules from the list and apply them.
  document.querySelector('#random-rules-button').addEventListener('click', (e) => {
    let ruleIndex = Math.floor(Math.random() * ruleSets.length);
    let rules = ruleSets[ruleIndex];
    if(!applyRulesToBox) updateRules(sim, generateUpdateFunction(...rules));

    rulesForm.querySelector('#underpopulation').value = rules[0];
    rulesForm.querySelector('#overpopulation').value = rules[1];
    rulesForm.querySelector('#reproduction-min').value = rules[2];
    rulesForm.querySelector('#reproduction-max').value = rules[3];
  });

  // Toggle rainbow mode
  let rainbow = false;
  document.querySelector('#toggle-rainbow-button').addEventListener('click', (e) => {
    if(!rainbow) {
      setRainbowScheme(sim);
    }
    else {
      lifeStyle = '#000000', deathStyle = '#ADD8E6'
      resetColors(sim, lifeStyle, deathStyle);
    }
    rainbow = !rainbow;
  });

  // Pick a random color scheme
  document.querySelector('#random-color-button').addEventListener('click', (e) => {
    randomColors(sim);
  });

  // Kill all life.
  document.querySelector('#reset-life-button').addEventListener('click', (e) => {
    let chanceOfLife = rulesForm.querySelector('#percent-life-reset').value;
    resetLife(sim, parseFloat(chanceOfLife).toFixed(4));

    // let rules = [
    //   parseInt(rulesForm.querySelector('#underpopulation').value, 10),
    //   parseInt(rulesForm.querySelector('#overpopulation').value, 10),
    //   parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
    //   parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    // ];
    //
    // updateRules(sim, generateUpdateFunction(...rules));
  });

  /**
   WHACKY EXPERIMENT -- Toggle Life Parameters Between Box
  **/
  let applyRulesToBox = false;
  document.querySelector('#toggle-rules-box').addEventListener('click', (e) => {
    applyRulesToBox = !applyRulesToBox;
    if(applyRulesToBox) {
      e.target.style.background = '#eeee88';
    }
    else {
      e.target.style.background = '#eeeeee';
    }
  });
  let mouseDownX;
  let mouseDownY;
  sim.canvas.addEventListener('mousedown', (e) => {
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY;
  });

  let mouseupX;
  let mouseupY;
  sim.canvas.addEventListener('mouseup', (e) => {
    if(!applyRulesToBox) return;
    mouseUpX = e.offsetX;
    mouseUpY = e.offsetY;

    let rowStart = Math.floor(Math.min(mouseUpY, mouseDownY) / sim.pixelSize);
    let rowStop = Math.ceil(Math.max(mouseUpY, mouseDownY) / sim.pixelSize);

    let colStart = Math.floor(Math.min(mouseUpX, mouseDownX) / sim.pixelSize);
    let colStop = Math.ceil(Math.max(mouseUpX, mouseDownX) / sim.pixelSize);

    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    ];

    applyRulesWithin(sim, rowStart, rowStop, colStart, colStop, generateUpdateFunction(...rules))
  });
}

/*
  Given a bounding box, apply the currently selected rules to ONLY the
  pixels within the provided box.
*/
function applyRulesWithin(sim, rowStart, rowStop, colStart, colStop, rules) {
  let [lifeStyle, deathStyle] = randomColorPair();
  for(let i = rowStart; i < rowStop; i++) {
    for(let j = colStart; j < colStop; j++) {
      sim.grid[i][j].update = rules;
      sim.grid[i][j].lifeStyle = lifeStyle;
      sim.grid[i][j].deathStyle = deathStyle;
    }
  }
}

/*
  Make everything rainbow colored dawwg.
*/
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
  Apply a random update function to a provided sim.
*/
function rotateSim(sim, ruleSets) {
  let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  updateRules(sim, generateUpdateFunction(...ruleSets[ruleIndex]));
}

/*
  Generate a new simulation with a random update function.
*/
function randomSimulation(rows, cols, pixelSize, roundDelay, chanceOfLife, ruleSets) {
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife)
  let ruleIndex = Math.floor(Math.random() * ruleSets.length);
  updateRules(sim, generateUpdateFunction(...ruleSets[ruleIndex]));

  return sim;
}

/*
  Set all the pixels to alive=false
*/
function resetLife(sim, chanceOfLife = .1) {
  sim.grid.forEach((row) => {
    row.forEach((entity) => {
      entity.alive = Math.random() < chanceOfLife;
    });
  });
}

/*
  Update the rules for all the pixels
*/
function updateRules(sim, updateFunction) {
  sim.grid.forEach((row) => {
    row.forEach((entity) => {
      entity.update = updateFunction;
    });
  });
}

/*
  Restore default life/death colors
*/
function resetColors(sim, lifeStyle, deathStyle) {
  sim.grid.forEach((row) => {
    row.forEach((entity) => {
      entity.lifeStyle = lifeStyle;
      entity.deathStyle = deathStyle;
    });
  });
}

/*
  Give the board random complementary colors
*/
function randomColors(sim) {
  let [lifeStyle, deathStyle] = randomColorPair(sim);
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
