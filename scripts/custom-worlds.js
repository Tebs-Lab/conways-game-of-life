function createOceanSim(rows, cols, pixelSize, roundDelay) {
  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, 0);

  let oceanHeight = Math.floor(rows * .75);
  let liveBar = randomInteger(oceanHeight, sim.grid.length);
  let [oUnderpopulation, oOverpopulation, oReproductionMin, oReproductionMax] = [2, 2, 3, 3];
  let [oceanLife, oceanDeath] = randomColorPair();

  sim.grid.forEach((row, i) => {
    row.forEach((entity) => {
      if(i > oceanHeight){
        entity.underpopulation = oUnderpopulation;
        entity.overpopulation = oOverpopulation;
        entity.reproductionMin = oReproductionMin;
        entity.reproductionMax = oReproductionMax;
        entity.lifeStyle = oceanLife;
        entity.deathStyle = oceanDeath;
      }

      if(i === liveBar) {
        entity.alive = true;
      }
    });
  });

  sim.setRainbowScheme();

  return sim;
}

/*
  Create the "wild ocean" shape.
*/
function createWildOceanSim(rows, cols, pixelSize, roundDelay) {
  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, 0);

  let oceanHeight = Math.floor(rows / 2);
  let midOceanHeight = oceanHeight + Math.floor(oceanHeight / 2)
  let midOceanWidth = Math.floor(cols / 2);

  let [oUnderpopulation, oOverpopulation, oReproductionMin, oReproductionMax] = [2, 2, 3, 3];
  let [lgUnderpopulation, lgOverpopulation, lgReproductionMin, lgReproductionMax] = [9, 0, 0, 4];

  let [oceanLife, oceanDeath] = randomColorPair();
  let [lifeGenLife, lifeGenDeath] = randomColorPair();

  sim.grid.forEach((row, i) => {
    row.forEach((entity, j) => {
      if(i > oceanHeight){
        entity.underpopulation = oUnderpopulation;
        entity.overpopulation = oOverpopulation;
        entity.reproductionMin = oReproductionMin;
        entity.reproductionMax = oReproductionMax;
        entity.lifeStyle = oceanLife;
        entity.deathStyle = oceanDeath;
      }

      if(i === midOceanHeight || i === sim.grid.length - 1 || (j === midOceanWidth)) {
        entity.underpopulation = lgUnderpopulation;
        entity.overpopulation = lgOverpopulation;
        entity.reproductionMin = lgReproductionMin;
        entity.reproductionMax = lgReproductionMax;
        entity.lifeStyle = lifeGenLife;
        entity.deathStyle = lifeGenDeath;
      }
    });
  });

  return sim;
}

/*
  Create the "creeping ivy" shape.
*/
function createCreepyIvySim(rows, cols, pixelSize, roundDelay) {
  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, 0);

  let barThickness = Math.ceil(rows / 7);
  let columnThinkness = Math.ceil(cols / 5);
  let [ivyUnderpopulation, ivyOverpopulation, ivyReproductionMin, ivyReproductionMax] = [2, 5, 3, 3];
  let [ivyLife, ivyDeath] = randomColorPair();
  let [regLife, regDeath] = randomColorPair();

  let doingIvyRow = false;
  sim.grid.forEach((row, i) => {
    if(i % barThickness == 0) doingIvyRow = !doingIvyRow;
    let doingIvyCol = false; // First mod flips this...

    row.forEach((entity, j) => {
      if(j % columnThinkness == 0) doingIvyCol = !doingIvyCol;
      if(doingIvyRow || doingIvyCol){
        entity.underpopulation = ivyUnderpopulation;
        entity.overpopulation = ivyOverpopulation;
        entity.reproductionMin = ivyReproductionMin;
        entity.reproductionMax = ivyReproductionMax;
        entity.lifeStyle = ivyLife;
        entity.deathStyle = ivyDeath;
      }
      else {
        entity.alive = Math.random() < .2;
        entity.lifeStyle = regLife;
        entity.deathStyle = regDeath;
      }
    });
  });
  return sim;
}

function createGridLockSim(rows, cols, pixelSize, roundDelay, chanceOfLife = .01, squareSize = 20) {
  let sim = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife);
  let squaresPerRow = Math.floor(cols / squareSize);
  let [aLife, aDeath] = randomColorPair();
  let [bLife, bDeath] = randomColorPair();

  // yuck...
  let gridLock = true;
  for(let r = 0; r < rows; r += squareSize) {
    // If there are an odd number of rows this is required to keep the checker pattern
    if(squaresPerRow & 1 === 1) gridLock = !gridLock;
    for(let c = 0; c < cols; c += squareSize) {
      gridLock = !gridLock;
        for(let i = 0; i < squareSize; i++) {
          for(let j = 0; j < squareSize; j++) {
            if(r + i > rows || c + j > cols) continue;
            let entity = sim.grid[r + i][c + j];
            if(entity && gridLock) {
              entity.underpopulation = 2;
              entity.overpopulation = 4;
              entity.reproductionMin = 2;
              entity.reproductionMax = 2;
              entity.lifeStyle = aLife;
              entity.deathStyle = aDeath;
            }
            else if(entity && !gridLock) {
              entity.underpopulation = 1;
              entity.overpopulation = 4;
              entity.reproductionMin = 3;
              entity.reproductionMax = 3;
              entity.lifeStyle = bLife;
              entity.deathStyle = bDeath;
          }
        }
      }
    }
  }

  return sim;
}
