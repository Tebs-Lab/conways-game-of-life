const COOL_RULES = {
  /*
    These rules are good for drawing shapes.
  */
  shapeMakers: {
    floatingDiamondsOne: [5, 1, 3, 7],
    floatingDiamondsTwo: [6, 8, 3, 5],
    glitzyGlobs: [0, 7, 5, 8],
    technoCrispy: [1, 6, 4, 8],
    collapsingLines: [2, 4, 5, 6],
    stableLines: [0, 4, 5, 6]
  },

  /*
    These all become loud "white noise" with random initial conditions. But used properly...

    Start with an empty grid, and expiment.
  */
  chaos: {
    rocketry: [0, 0, 2, 2], // Use a 1x2 rectagle to create rocket ships.
    flickerBox: [8, 8, 1, 1], // single dot, filled 3x3, and single lines all do cool stuff
    laserDisk: [7, 8, 2, 5]
  },

  /*
    These paterns generally stabalize instead of looking like white noise. But
    they keep roughly however much life you give them to start.
  */
  autoStabalizers: {
    noDeathNoRebirth: [5, 7, 5, 6],
    shatteredGlass: [2, 6 ,0 ,2]
  },

  /*
    These paterns generally stabalize instead of looking like white noise. But
    they quickly fill the grid from just a little life as well.
  */
  growthStabalizers: {
    mayanBricks: [2, 4 ,1 ,2], // n by 2 single stripe does special stuff
    fillOut: [2, 7, 4, 5],
    criticalMass: [3, 7, 4, 7]
  },

  /*
    These patterns will generally stabalize instead of looking like white noise.
    But they will quickly decay until there are only a few stable shapes and pulsars.

    The original fits into this category
  */
  decayStabalizers: {
    original: [2, 3, 3, 3],
    starscape: [1, 3, 4, 7],
    tetrimino: [2, 4, 5, 6],
    alphabetSoup: [2, 5, 5, 6],
    antTunnel: [4, 7, 7, 7], // start with about 90% life
    honeyComb: [0, 7, 4, 6]
  }
}

var COOL_RULE_LIST = [];
for(let type of Object.keys(COOL_RULES)) {
  for(let name in COOL_RULES[type]) {
    COOL_RULE_LIST.push(COOL_RULES[type][name]);
  }
}
