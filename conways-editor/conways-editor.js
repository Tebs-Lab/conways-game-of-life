// For a wild experience...
// let sim = createWildOceanSim(rows, cols, pixelSize, roundDelay, chanceOfLife, startingUpdate);
// let sim = createOceanSim(rows, cols, pixelSize, roundDelay, chanceOfLife, startingUpdate);

// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 100;
  let chanceOfLife = .0;

  let container = document.getElementById('container');
  let canvasWidth = window.innerWidth * .78;
  let canvasHeight = window.innerHeight * .95;
  let cols = canvasWidth / pixelSize;
  let rows = canvasHeight / pixelSize;

  let ruleSets = generateRuleSets();
  let sim = new Simulation(rows, cols, pixelSize, roundDelay, chanceOfLife);

  sim.canvas.style.height = canvasHeight + 'px';
  sim.canvas.style.width = canvasWidth + 'px';
  container.append(sim.canvas);
  sim.repaint();
  sim.start();

  let startingRules = [2, 3, 3, 3];
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

    updateRules(sim, ...rules);
  });

  // Select random rules from the list and apply them.
  document.querySelector('#random-rules-button').addEventListener('click', (e) => {
    let ruleIndex = Math.floor(Math.random() * ruleSets.length);
    let rules = ruleSets[ruleIndex];
    if(!applyRulesToBox) updateRules(sim, ...rules);

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
    setRandomColors(sim);
  });

  // Pause/Play
  let pause = () => {
    if (sim.paused) {
      sim.start();
    }
    else {
      sim.stop();
    }

    sim.paused = !sim.paused;
  }

  window.addEventListener('keydown', (e) => {
    if(e.which === 90) {
      pause();
    }
  });

  document.querySelector('#pause-play-button').addEventListener('click', (e) => {
    pause();
  });



  // Kill all life.
  document.querySelector('#reset-life-button').addEventListener('click', (e) => {
    let chanceOfLife = rulesForm.querySelector('#percent-life-reset').value;
    chanceOfLife = parseFloat(chanceOfLife)
    resetLife(sim, chanceOfLife);
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

  let mouseIsDown = false;
  let mouseDownX;
  let mouseDownY;
  sim.canvas.addEventListener('mousedown', (e) => {
    mouseIsDown = true;
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY;
  });

  let mouseupX;
  let mouseupY;
  sim.canvas.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
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

    applyRulesWithin(sim, rowStart, rowStop, colStart, colStop, ...rules)
    let [lifeStyle, deathStyle] = randomColorPair();
    applyColorsWithin(sim, rowStart, rowStop, colStart, colStop, lifeStyle, deathStyle)
  });

  sim.canvas.addEventListener('mousemove', (e) => {
    if(!mouseIsDown || !applyRulesToBox) return;
    let left = Math.min(mouseDownX, e.offsetX);
    let top = Math.min(mouseDownY, e.offsetY);
    let right = Math.max(mouseDownX, e.offsetX);
    let bottom = Math.max(mouseDownY, e.offsetY);
    sim.repaint(force = true);
    sim.canvasCtx.fillStyle = "rgba(200, 200, 200, .5)";
    sim.canvasCtx.fillRect(left, top, Math.abs(left - right), Math.abs(top - bottom));
  });
}
