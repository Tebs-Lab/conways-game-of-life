/*
  A wrapper for an HTML <canvas> based visualizatiuon of Conway's Game of Life.
*/
class ConwaySimulator {

  /*
    Create a new simulation. A simulation is comprised of a
    2D data grid (rows-by-cols) of ConwayPixels, a canvas element,
    and a canvas context.
  */
  constructor(rows, cols, pixelSize, interRoundDelay, initialChanceOfLife) {
    this.rows = rows;
    this.cols = cols;
    this.pixelSize = pixelSize;
    this.interRoundDelay = interRoundDelay;
    this.mouseIsDown = false;
    this.paused = false;
    this.intervalId = null;

    // Make the grid
    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid.push([]);
      for (let j = 0; j < cols; j++) {
        let alive = Math.random() < initialChanceOfLife;
        this.grid[i].push(new ConwayPixel(alive));
      }
    }

    // Inform each pixel who it's neighbors are (performance optimization)
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        this.grid[i][j].neighbors = this.getNeighbors(i, j);
      }
    }

    // Setup the canvas
    let width = this.pixelSize * this.cols
    let height = this.pixelSize * this.rows
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasCtx = this.canvas.getContext('2d', { alpha: false});

    this.registerMouseListeners();
  }

  /*
    Starts the simulation via setInterval if it's not running
  */
  start() {
    if(this.intervalId){
      return;
    }

    this.intervalId = setInterval(() => {
      this.advanceRound();
      this.repaint();
    }, this.interRoundDelay);
  }

  /*
    If the simulation is running, stop it using clearInterval
  */
  stop() {
    if(this.intervalId){
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /*
    Return the neighbors of a particular grid location
  */
  getNeighbors(row, col) {
    let neighbors = [];
     for(let i = row - 1; i <= row + 1; i++) {
       for(let j = col - 1; j <= col + 1; j++) {
         if(i === row && j === col) continue;
         if(this.grid[i] && this.grid[i][j]) {
             neighbors.push(this.grid[i][j]);
         }
       }
     }

     return neighbors;
  }

  /*
    Update the grid according to the rules for each SimEntity
  */
  advanceRound() {
    if(this.mouseIsDown) return;

    // First prepare each pixel (give it a next state)
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        this.grid[i][j].prepareUpdate();
      }
    }

    // Then actually advance them, once all the new states are computed
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        this.grid[i][j].update();
      }
    }
  }

  /*
    Optimized repaint that only updates pixels that have changed, and paints
    in batches by color. Using force will repaint all pixels regardless of their
    state/previousState/nextState, which is slower.
  */
  repaint(force = false) {
    if(this.mouseIsDown && !force) return;

    // Canvas optimization -- it's faster to paint by color than placement.
    let byColor = {};
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        let pixel = this.grid[i][j];

        if(!force && !pixel.forceRepaint && pixel.alive === pixel.previousState){
          continue; // No need to repaint if the pixel didn't change
        }

        let color = pixel.alive ? pixel.lifeStyle : pixel.deathStyle;
        if(byColor[color] === undefined) {
          byColor[color] = []
        }

        byColor[color].push([i, j]);
        pixel.forceRepaint = false; // Once a pixel is painted, reset it's forced state
      }
    }

    for(let color in byColor) {
      this.canvasCtx.fillStyle = color;
      for(let [row, col] of byColor[color]){
        this.canvasCtx.fillRect(
          col * this.pixelSize,
          row * this.pixelSize,
          this.pixelSize,
          this.pixelSize
        );
      }
    }
  }

  /*
    Paint an individual pixel. This is not used by repaint because of a batch
    optimziation. painting an individual pixel does take place when click events
    happen.
  */
  paintPixel(row, col) {
    this.grid[row][col].setPaintStyles(this.canvasCtx);
    this.canvasCtx.fillRect(
      col * this.pixelSize,
      row * this.pixelSize,
      this.pixelSize,
      this.pixelSize
    );
  }

  /* =============
  Visualizatiuon Modifiers
  ================ */

  /*
    Give each entity in the grid an alive style such that when all pixels are alive
    the grid would be a rainbow gradient.
  */
  setRainbowScheme() {
    let rows = this.grid.length;
    let cols = this.grid[0].length;
    let diagonalLength = Math.sqrt((this.rows * this.rows) + (this.cols * this.cols));
    let hueIncrement = 360 / diagonalLength;

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
        let px = this.grid[i][j];
        px.lifeStyle = `hsl(${h}, 100%, 60%)`;
        px.deathStyle = `#000000`;
        px.forceRepaint = true;
      }
    }
  }

  /*
    Give each entity in the specified area of the grid an alive style
    such that when all pixels are alive the area would be a rainbow gradient.
  */
  setRainbowSchemeWithin(startRow, stopRow, startCol, stopCol) {
    let rows = stopRow - startRow;
    let cols = stopCol - startCol;
    let diagonalLength = Math.sqrt((rows * rows) + (cols * cols));
    let hueIncrement = 360 / diagonalLength;

    for(let i = startRow; i < stopRow; i++) {
      for(let j = startCol; j < stopCol; j++) {
        let h = Math.floor(Math.sqrt((i * i) + (j * j)) * hueIncrement);
        let px = this.grid[i][j];
        px.lifeStyle = `hsl(${h}, 100%, 60%)`;
        px.deathStyle = `#000000`;
        px.forceRepaint = true;
      }
    }
  }

  /*
    set colors to the provided parameters
  */
  setPixelColors(lifeStyle, deathStyle) {
    this.grid.forEach((row) => {
      row.forEach((entity) => {
        entity.lifeStyle = lifeStyle;
        entity.deathStyle = deathStyle;
        entity.forceRepaint = true;
      });
    });
  }

  /*
    Give the board random semi-complementary colors.
  */
  setRandomPixelColors() {
    let baseHue = randomInteger(1, 360);
    let complementaryHue = (baseHue + randomInteger(90, 270) % 360);
    this.setPixelColors(`hsl(${baseHue}, 100%, 60%)`, `hsl(${complementaryHue}, 100%, 60%)`)
  }

  /*
    Given a bounding box, apply the currently selected rules to ONLY the
    pixels within the provided box.
  */
  applyColorsWithin(rowStart, rowStop, colStart, colStop, lifeStyle, deathStyle) {
    for(let i = rowStart; i < rowStop; i++) {
      for(let j = colStart; j < colStop; j++) {
        let pixel = this.grid[i][j];
        pixel.lifeStyle = lifeStyle;
        pixel.deathStyle = deathStyle;
        pixel.forceRepaint = true;
      }
    }
  }

  /*
    Give a sopecific area of the board random semi-complementary colors.
  */
  applyRandomColorsWithin(rowStart, rowStop, colStart, colStop) {
    let baseHue = randomInteger(1, 360);
    let complementaryHue = (baseHue + randomInteger(90, 270) % 360);
    this.applyColorsWithin(rowStart, rowStop, colStart, `hsl(${baseHue}, 100%, 60%)`, `hsl(${complementaryHue}, 100%, 60%)`)
  }

  /*
    Set all the pixels to alive=false
  */
  resetLife(chanceOfLife) {
    this.grid.forEach((row) => {
      row.forEach((pixel) => {
        pixel.previousState = pixel.alive;
        pixel.alive = Math.random() < chanceOfLife;
      });
    });

    this.repaint();
  }


  /*
    Given a bounding box, apply the currently selected rules to ONLY the
    pixels within the provided box.
  */
  resetLifeWithin(rowStart, rowStop, colStart, colStop, chanceOfLife = .1) {
    for(let i = rowStart; i < rowStop; i++) {
      for(let j = colStart; j < colStop; j++) {
        let pixel = this.grid[i][j];
        if(pixel) {
          pixel.previousState = pixel.alive;
          pixel.alive = Math.random() < chanceOfLife;
        }
      }
    }

    this.repaint();
  }

  /*
    Update the rules for all the pixels
  */
  setRules(underpopulation, overpopulation, reproductionMin, reproductionMax) {
    this.grid.forEach((row) => {
      row.forEach((pixel) => {
        pixel.underpopulation = underpopulation;
        pixel.overpopulation = overpopulation;
        pixel.reproductionMin = reproductionMin;
        pixel.reproductionMax = reproductionMax;
      });
    });
  }

  /*
    Swap life and death styles across the center of the grid.
  */
  setYinYangMode() {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols / 2; j++) {
        let t = this.grid[i][j].lifeStyle;
        this.grid[i][j].lifeStyle = this.grid[i][j].deathStyle;
        this.grid[i][j].deathStyle = t;
      }
    }

    this.repaint(true);
  }

  /*
    Given a bounding box, apply the currently selected rules to ONLY the
    pixels within the provided box.
  */
  setRulesWithin(rowStart, rowStop, colStart, colStop,  underpopulation, overpopulation, reproductionMin, reproductionMax) {
    for(let i = rowStart; i < rowStop; i++) {
      for(let j = colStart; j < colStop; j++) {
        let pixel = this.grid[i][j];
        pixel.underpopulation = underpopulation;
        pixel.overpopulation = overpopulation;
        pixel.reproductionMin = reproductionMin;
        pixel.reproductionMax = reproductionMax;
        pixel.forceRepaint = true;
      }
    }
  }

  /*
    The grid has click, and click-and-drag functionality. Entities define their
    own behavior when clicked, and this function ensures the proper entity is
    updated when it is clicked (or dragged-over)
  */
  registerMouseListeners() {
    bindMultipleEventListener(this.canvas, ['mousemove', 'touchmove'], (e) =>  {
      e.preventDefault();
      if(this.mouseIsDown) {
        let x, y;
        if(e.touches) {
          let rect = e.target.getBoundingClientRect();
          x = Math.floor((e.touches[0].pageX - rect.left) / this.pixelSize);
          y = Math.floor((e.touches[0].pageY - rect.top) / this.pixelSize);
        }
        else {
          x = Math.floor(e.offsetX / this.pixelSize);
          y = Math.floor(e.offsetY / this.pixelSize);
        }

        this.grid[y][x].handleClick();
        this.paintPixel(y, x);
      }
    });

    // Capture mouse state for click and drag features
    bindMultipleEventListener(this.canvas, ['mousedown', 'touchstart'], (e) => {
      e.preventDefault();
      let rect = e.target.getBoundingClientRect();
      let x, y;
      if(e.touches) {
        let rect = e.target.getBoundingClientRect();
        x = Math.floor((e.touches[0].pageX - rect.left) / this.pixelSize);
        y = Math.floor((e.touches[0].pageY - rect.top) / this.pixelSize);
      }
      else {
        x = Math.floor(e.offsetX / this.pixelSize);
        y = Math.floor(e.offsetY / this.pixelSize);
      }

      this.grid[y][x].handleClick();
      this.paintPixel(y, x);
      this.mouseIsDown = true;
    });

    bindMultipleEventListener(this.canvas, ['mouseup', 'touchend'], (e) => {
      e.preventDefault();
      this.mouseIsDown = false;
    });
  }
}


/*
  A single pixel within a greater ConwaySimulator. Each ConwayPixel has it's own rules for evolution,
  and for performance reason's maintains a list of it's neighbors inside of it's simulator.

  This class is intended as an internal class, and is not exported. Manipulation of individual
  ConwayPixels outside of the ConwaySimulator class is not advised.
*/
class ConwayPixel {

  /*
    Constuct a default ConwayPixel, which follows the original Game of Life rules.
  */
  constructor(alive) {
    this.alive = alive;
    this.lifeStyle = '#000000';
    this.deathStyle = '#ADD8E6';
    this.underpopulation = 2;
    this.overpopulation = 3;
    this.reproductionMin = 3;
    this.reproductionMax = 3;

    // Experimental improvement...
    this.neighbors = [];
    this.nextState = null;
    this.previousState = null;
    this.forceRepaint = true;

    // Reproduction min cannot be more than reproduction max
    if(this.reproductionMax < this.reproductionMin) {
      this.reproductionMin = this.reproductionMax
    }
  }

  /*
    In order to process whole rounds at a time, update returns
    a replacement entity, it does not edit the entity in place.

    Following the rules for conway's game of life:
      Any live cell with fewer than two live neighbors dies,
      as if caused by underpopulation.

      Any live cell with two or three live neighbors lives on
      to the next generation.

      Any live cell with more than three live neighbors dies,
      as if by overpopulation.

      Any dead cell with exactly three live neighbors becomes
      a live cell, as if by reproduction.

  */
  prepareUpdate() {
    let sum = 0;
    let nextState = this.alive;

    for(let n of this.neighbors){
      if(n.alive && n !== this) sum++;
    }

    if(nextState && sum < this.underpopulation){
      nextState = false;
    }
    else if(nextState && sum > this.overpopulation) {
      nextState = false;
    }
    else if(!nextState && sum >= this.reproductionMin && sum <= this.reproductionMax) {
      nextState = true;
    }

    this.nextState = nextState;
  }

  /*
    Advance this pixel to it's nextState.
  */
  update() {
    this.previousState = this.alive;
    this.alive = this.nextState;
    this.nextState = null;
  }

  /*
    The calling context infers that a click HAS occured, this is not a mouse;
    this is not an event listener.
  */
  handleClick() {
    this.alive = true;
  }

  /*
    Provided with a canvas context, paint ourselves!
  */
  setPaintStyles(canvasCtx) {
    canvasCtx.fillStyle = this.alive ? this.lifeStyle : this.deathStyle;
  }
}
