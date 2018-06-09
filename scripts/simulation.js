class SimEntity {
  /*
    This simple sim entity for conways game of life is alive
    or not alive.
  */
  constructor(alive = false, lifeStyle = '#000000', deathStyle = '#ADD8E6', underpopulation = 2, overpopulation = 3, reproductionMin = 3, reproductionMax = 3) {
    this.alive = alive;
    this.lifeStyle = lifeStyle;
    this.deathStyle = deathStyle;
    this.underpopulation = underpopulation;
    this.overpopulation = overpopulation;
    this.reproductionMin = reproductionMin;
    this.reproductionMax = reproductionMax;

    // Experimental improvement...
    this.neighbors = [];

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
    let alive = this.alive;

    for(let n of this.neighbors){
      if(n.alive && n !== this) sum++;
    }

    if(alive && sum < this.underpopulation){
      alive = false;
    }
    else if(alive && sum > this.overpopulation) {
      alive = false;
    }
    else if(!alive && sum >= this.reproductionMin && sum <= this.reproductionMax) {
      alive = true;
    }

    this.nextState = alive;
  }

  /*
    Advance this pixel to it's nextState.
  */
  update() {
    this.alive = this.nextState;
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

class Simulation {
  /*
    Create a new simulation. A simulation is comprised of a
    2D data grid (rows-by-cols) of tities, a canvas element
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
        this.grid[i].push(new SimEntity(alive));
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
    Repaint the grid; loop through each entity in the grid to paint.
  */
  repaint(force = false) {
    if(this.mouseIsDown && !force) return;

    // Canvas optimization -- it's faster to paint by color than placement.
    let byColor = {};
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        let pixel = this.grid[i][j];
        let color = pixel.alive ? pixel.lifeStyle : pixel.deathStyle;

        if(byColor[color] === undefined) {
          byColor[color] = []
        }

        byColor[color].push([i, j]);
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

        // let x = Math.floor(e.offsetX / this.pixelSize) || Math.floor(e.touches[0].clientX / this.pixelSize);
        // let y = Math.floor(e.offsetY / this.pixelSize) ||  Math.floor(e.touches[0].clientY / this.pixelSize);
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
