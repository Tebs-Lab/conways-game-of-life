class SimEntity {
  /*
    This simple sim entity for conways game of life is alive
    or not alive.
  */
  constructor(alive = false, lifeStyle = '#000000', deathStyle = '#ADD8E6', update = null) {
    this.alive = alive;
    this.lifeStyle = lifeStyle;
    this.deathStyle = deathStyle;

    // TODO: check for function?
    if(update !== null) {
      this.update = update;
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
  update(neighbors) {
    let sum = 0;
    let alive = this.alive;

    for(let n of neighbors){
      if(n.alive && n !== this) sum++;
    }

    if(alive) {
      if(sum < 2){
        alive = false;
      }
      else if(sum <= 3) {
        alive = true;
      }
      else {
        alive = false;
      }
    }
    else if (sum === 3) {
      alive = true;
    }

    return new SimEntity(alive, this.lifeStyle, this.deathStyle, this.update);
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
        this.grid[i].push(new SimEntity(Math.random() < initialChanceOfLife))
      }
    }

    // Setup the canvas
    let width = this.pixelSize * this.cols
    let height = this.pixelSize * this.rows
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasCtx = this.canvas.getContext('2d');

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
    let nextState = [];
    for(let i = 0; i < this.rows; i++) {
      nextState.push([]);
      for(let j = 0; j < this.cols; j++) {
        let entity = this.grid[i][j];
        nextState[i].push(
          entity.update(this.getNeighbors(i, j))
        );
      }
    }

    this.grid = nextState;
  }

  /*
    Repaint the grid; loop through each entity in the grid to paint.
  */
  repaint() {
    if(this.mouseIsDown) return;

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        this.paintPixel(i, j);
      }
    }
  }

  /*
    Paint an individual pixel.
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
    this.canvas.addEventListener('mousedown', (e) => {
      let x = Math.floor(e.offsetX / this.pixelSize);
      let y = Math.floor(e.offsetY / this.pixelSize);
      this.grid[y][x].handleClick();
      this.paintPixel(y, x);
    });

    this.canvas.addEventListener('mousemove', (e) =>  {
      if(this.mouseIsDown) {
        let x = Math.floor(e.offsetX / this.pixelSize);
        let y = Math.floor(e.offsetY / this.pixelSize);
        this.grid[y][x].handleClick();
        this.paintPixel(y, x);
      }
    });

    // Capture mouse state for click and drag features
    this.canvas.addEventListener('mousedown', () => {
      this.mouseIsDown = true;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseIsDown = false;
    });
  }
}
