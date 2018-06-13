let ALL_RULES = generateRuleSets();

 // TODO: This is a bad hack in order to prevent JavaScript from keeping a bunch of references
 // to stale ConwaySimulation instances inside of the closure context for event handlers.
let CURRENT_SIM = null;

// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 8;
  let roundDelay = 40;
  let chanceOfLife = .0;
  let rules = [2, 3, 3, 3]

  resetSimulation(pixelSize, roundDelay, rules, chanceOfLife);
  setupEventListeners(rules, pixelSize, roundDelay, chanceOfLife);
});

function resetSimulation(pixelSize, roundDelay, rules, chanceOfLife) {
  let container = document.getElementById('container');
  let previousCanvas = container.querySelector('canvas');
  if(previousCanvas) container.removeChild(previousCanvas);

  let canvasWidth = window.innerWidth * .78;
  let canvasHeight = window.innerHeight * .95;
  let cols = canvasWidth / pixelSize;
  let rows = canvasHeight / pixelSize;

  CURRENT_SIM = new ConwaySimulator(rows, cols, pixelSize, roundDelay, chanceOfLife);
  CURRENT_SIM.setRules(...rules);

  if(document.querySelector('#toggle-rainbow-button').inRainbowMode) {
    CURRENT_SIM.setRainbowScheme();
  }
  else if(document.querySelector('#random-color-button').inRandomColorMode) {
    let randomColorButton = document.querySelector('#random-color-button')
    CURRENT_SIM.setPixelColors(randomColorButton.lifeStyle, randomColorButton.deathStyle);
  }

  CURRENT_SIM.canvas.style.height = canvasHeight + 'px';
  CURRENT_SIM.canvas.style.width = canvasWidth + 'px';
  container.append(CURRENT_SIM.canvas);
  CURRENT_SIM.repaint();
  CURRENT_SIM.start();

  // Easter egg...
  window.CURRENT_SIM = CURRENT_SIM;
}

// Easter egg continued
function randomCoolRule() {
  let i = Math.floor(Math.random() * COOL_RULE_LIST.length);
  let rules = COOL_RULE_LIST[i];
  document.querySelector('#underpopulation').value = rules[0];
  document.querySelector('#overpopulation').value = rules[1];
  document.querySelector('#reproduction-min').value = rules[2];
  document.querySelector('#reproduction-max').value = rules[3];
  CURRENT_SIM.setRules(...rules);
}

console.log("Thanks for opening up the console, the curious are rewarded! Try running this function...");
console.log('randomCoolRule()');
console.log("And please explore the COOL_RULES, and CURRENT_SIM global variables.");


/*
  Set all the event listeners. TODO: This function needs to be broken up and cleaned up a lot.
*/
function setupEventListeners(initialRules, initialPixelSize, initialRoundDelay, initialChanceOfLife) {
  // First, set the initial parameters so that the form matches the code.
  let rulesForm = document.querySelector('#sim-parameters');
  rulesForm.querySelector('#underpopulation').value = initialRules[0];
  rulesForm.querySelector('#overpopulation').value = initialRules[1];
  rulesForm.querySelector('#reproduction-min').value = initialRules[2];
  rulesForm.querySelector('#reproduction-max').value = initialRules[3];
  rulesForm.querySelector('#percent-life-reset').value = initialChanceOfLife;
  rulesForm.querySelector('#frame-rate').value = initialRoundDelay;
  rulesForm.querySelector('#pixel-size').value = initialPixelSize;


  rulesForm.addEventListener('submit' , (e) => { e.preventDefault(); });

  // Apply the rules from the form
  document.querySelector('#update-rules-button').addEventListener('click', (e) => {
    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    ];

    CURRENT_SIM.setRules(...rules);
  });

  // Select random rules from the list and apply them.
  document.querySelector('#random-rules-button').addEventListener('click', (e) => {
    let ruleIndex = Math.floor(Math.random() * ALL_RULES.length);
    let rules = ALL_RULES[ruleIndex];
    if(!applyRulesToBox) CURRENT_SIM.setRules(...rules);

    rulesForm.querySelector('#underpopulation').value = rules[0];
    rulesForm.querySelector('#overpopulation').value = rules[1];
    rulesForm.querySelector('#reproduction-min').value = rules[2];
    rulesForm.querySelector('#reproduction-max').value = rules[3];
  });

  // Toggle Color Mode's interact with each other.
  // Saving these properties on the buttons is ... a hack.
  let rainbowButton = document.querySelector('#toggle-rainbow-button');
  rainbowButton.inRainbowMode = false;

  let randomColorButton = document.querySelector('#random-color-button');
  randomColorButton.inRandomColorMode = false;

  /* RAINBOW SCHEME */
  rainbowButton.addEventListener('click', (e) => {
    if(!rainbowButton.inRainbowMode) {
      CURRENT_SIM.setRainbowScheme();
    }
    else {
      lifeStyle = '#000000', deathStyle = '#ADD8E6'
      CURRENT_SIM.setPixelColors(lifeStyle, deathStyle);
    }

    rainbowButton.inRainbowMode = !e.target.inRainbowMode;
    randomColorButton.inRandomColorMode = false;
  });

  /* RANDOM COLOR SCHEME */
  randomColorButton.addEventListener('click', (e) => {
    CURRENT_SIM.setRandomPixelColors();

    // This is a slight hack...
    randomColorButton.lifeStyle = CURRENT_SIM.grid[0][0].lifeStyle;
    randomColorButton.deathStyle = CURRENT_SIM.grid[0][0].deathStyle;

    rainbowButton.inRainbowMode = false;
    randomColorButton.inRandomColorMode = true;
  });

  // Pause/Play
  let pause = () => {
    if (CURRENT_SIM.paused) {
      CURRENT_SIM.start();
    }
    else {
      CURRENT_SIM.stop();
    }

    CURRENT_SIM.paused = !CURRENT_SIM.paused;
  }

  window.addEventListener('keydown', (e) => {
    if(e.which === 90) {
      pause();
    }
  });

  document.querySelector('#pause-play-button').addEventListener('click', (e) => {
    pause();
  });

  /*
    Listen for changes in the frame rate slider.
  */
  document.querySelector('#frame-rate').addEventListener('change', (e) => {
    CURRENT_SIM.stop();
    CURRENT_SIM.interRoundDelay = Math.floor(Math.pow(e.target.value, 1.3));
    CURRENT_SIM.start();
  });

  /*
    Listen for chages in pixel size -- this change requires a total reset.
  */
  document.querySelector('#pixel-size').addEventListener('change', (e) => {
    CURRENT_SIM.stop();
    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    ];

    let chanceOfLife = rulesForm.querySelector('#percent-life-reset').value;
    chanceOfLife = parseFloat(chanceOfLife)

    resetSimulation(parseInt(e.target.value), CURRENT_SIM.interRoundDelay, rules, chanceOfLife);
  });

  // Kill all life.
  document.querySelector('#reset-life-button').addEventListener('click', (e) => {
    let chanceOfLife = rulesForm.querySelector('#percent-life-reset').value;
    chanceOfLife = parseFloat(chanceOfLife)
    CURRENT_SIM.resetLife(chanceOfLife);
  });

  /**
    Toggle Life Parameters Between Box
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

  // State for toggle ruleBoxMode
  let mouseIsDown = false;
  let mouseDownX;
  let mouseDownY;
  let mouseupX;
  let mouseupY;

  container.addEventListener('mousedown', (e) => {
    mouseIsDown = true;
    mouseDownX = e.offsetX;
    mouseDownY = e.offsetY;
  });

  container.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
    if(!applyRulesToBox) return;
    mouseUpX = e.offsetX;
    mouseUpY = e.offsetY;

    let rowStart = Math.floor(Math.min(mouseUpY, mouseDownY) / CURRENT_SIM.pixelSize);
    let rowStop = Math.ceil(Math.max(mouseUpY, mouseDownY) / CURRENT_SIM.pixelSize);

    let colStart = Math.floor(Math.min(mouseUpX, mouseDownX) / CURRENT_SIM.pixelSize);
    let colStop = Math.ceil(Math.max(mouseUpX, mouseDownX) / CURRENT_SIM.pixelSize);

    let rules = [
      parseInt(rulesForm.querySelector('#underpopulation').value, 10),
      parseInt(rulesForm.querySelector('#overpopulation').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-min').value, 10),
      parseInt(rulesForm.querySelector('#reproduction-max').value, 10)
    ];

    CURRENT_SIM.setRulesWithin(rowStart, rowStop, colStart, colStop, ...rules);
    CURRENT_SIM.repaint(true);
  });

  container.addEventListener('mousemove', (e) => {
    if(!mouseIsDown || !applyRulesToBox) return;
    let left = Math.min(mouseDownX, e.offsetX);
    let top = Math.min(mouseDownY, e.offsetY);
    let right = Math.max(mouseDownX, e.offsetX);
    let bottom = Math.max(mouseDownY, e.offsetY);
    CURRENT_SIM.repaint(force = true);
    CURRENT_SIM.canvasCtx.fillStyle = "rgba(200, 200, 200, .5)";
    CURRENT_SIM.canvasCtx.fillRect(left, top, Math.abs(left - right), Math.abs(top - bottom));
  });
}
