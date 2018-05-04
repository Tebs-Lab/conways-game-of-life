# Conways Game Of Life

Much has already been written about the [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) so I won't describe it here. I was inspired to play around with the game, and have created this browser based implementation of the game, along with some fun modifications. You can get right down to business, and play around with all the modifications [here](https://tebs-game-of-life.com).

## Mods & Documentation

There are currently a number of simulations/applications, each with different rules and behaviors. In all modes you can click on the grid to add life, and in most of the modes (esp. modes with one grid) you can pause the simulation by pressing z.

### Single Large Grid Mode

The (single large grid)[https://tebs-game-of-life.com/single-large/single-large.html] mode takes the full page, and can be started and stopped by clicking the button at the bottom of the page or by pressing the z key when the focus is on the canvas element. You can click anywhere to add life. Life is seeded randomly, with a 10% chance of any cell staring alive.

### Three By Three

[Three by three](https://tebs-game-of-life.com/three-by-three/three-by-three.html) is an Andy Warhol inspired version of Conway's game of life.

### Random Rules

Taking three by three to the limit, [random rules](https://tebs-game-of-life.com/random-rules/random-rules.html) creates 16 grids, each with randomly chosen color schemes and randomly chosen rules. The rules and color schemes automatically update themselves every 5-10 seconds.

### Grid Maker

[Grid maker](https://tebs-game-of-life.com/grid-maker/grid-maker-form.html) is the logical conclusion of three by three and random rules. Using a web-form you can customize the grid, pixel size, animation speed, and control if the rules and colors are randomized or not.

### Rainbow

[Rainbow](https://tebs-game-of-life.com/rainbow/rainbow.html) is a modification to Conway's rules -- the bottom quarter of the screen is a slightly "harsher" are, with cells dying due to underpopulation with fewer than 3 neighbors (as opposed to fewer than 2). Initial conditions for life are single horizontal line drawn randomly somewhere in the bottom quarter of the screen (the harsh zone).

### Wild Ocean

[Wild Ocean](https://tebs-game-of-life.com/wild-ocean/wild-ocean.html) is a mode that builds on the modifications of rainbow, but adds several different zones with different rules. In some places reproduction can happen without any neighbors; in some places life is harsh, and it's hard to survive.

### Conway's Editor

A fun tool to experiment with numerous different rules, configurations, and tools for creating your own version of Conway's Game of Life. Of special interest is the "toggle rule box" mode -- when in this mode highlighting a section of the grid will set the rules for only the highlighted areas. This tool is how I found the inspiration for simulations like Rainbow and Wild Ocean.
