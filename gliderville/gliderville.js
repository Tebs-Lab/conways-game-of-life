// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = 0;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .98;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);
  container.append(sim.canvas);
  setRainbowScheme(sim);

  let gliderCount = (rows * cols) / 400;
  let gliderMakers = [createDownRightGlider, createDownLeftGlider, createUpLeftGlider, createUpRightGlider];
  for(let i = 0; i < gliderCount; i++) {
    let top = rand(0, sim.grid.length - 3);
    let left = rand(0, sim.grid[0].length - 3);
    let gMaker = gliderMakers[rand(0, 4)];

    gMaker(sim, top, left);
  }

  let halfPointRow = Math.ceil(rows / 2);
  let halfPointCol = Math.ceil(cols / 2);
  let barHeight = Math.ceil(rows / 4);
  let barWidth = Math.ceil(cols / 4);
  applyRulesWithin(sim, halfPointRow - barHeight, halfPointRow + barHeight, halfPointCol - barWidth, halfPointCol + barWidth, 2, 4, 3, 3);
  // barWidth += 10;
  resetLifeWithin(sim, halfPointRow - barHeight, halfPointRow + barHeight, halfPointCol - barWidth, halfPointCol + barWidth, 0);

  sim.start();
  window.addEventListener('keydown', (e) => {
    if(sim.intervalId && e.which === 90) {
      sim.stop();
    }
    else if(e.which === 90) {
      sim.start();
    }
  });
});
