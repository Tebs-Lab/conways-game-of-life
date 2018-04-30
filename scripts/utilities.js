
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
      sim.grid[i][j].deathStyle = `#000000`;
    }
  }
}

/*
  set colors to the provided parameters
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
  Given a bounding box, apply the currently selected rules to ONLY the
  pixels within the provided box.
*/
function applyColorsWithin(sim, rowStart, rowStop, colStart, colStop, lifeStyle, deathStyle) {
  for(let i = rowStart; i < rowStop; i++) {
    for(let j = colStart; j < colStop; j++) {
      sim.grid[i][j].lifeStyle = lifeStyle;
      sim.grid[i][j].deathStyle = deathStyle;
    }
  }
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
  Given a bounding box, apply the currently selected rules to ONLY the
  pixels within the provided box.
*/
function applyRulesWithin(sim, rowStart, rowStop, colStart, colStop, rules) {
  for(let i = rowStart; i < rowStop; i++) {
    for(let j = colStart; j < colStop; j++) {
      sim.grid[i][j].update = rules;
    }
  }
}

/*
  Random bounded integer.
*/
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
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
