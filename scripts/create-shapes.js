/*
  Given a shape (2d array of true/false for alive/not-alive)
*/
function setShape(sim, top, left, shape) {
  for(let i = 0; i < shape.length; i++) {
    for(let j = 0; j < shape[i].length; j++) {
      sim.grid[top + i][left + j].alive = shape[i][j]
    }
  }
}

/*
  Create a down+right glider shape in the passed in sim at the location specified
*/
function createDownRightGlider(sim, top, left) {
  let shape = [
    [true, false, true],
    [false, false, true],
    [false, true,  true]
  ];
  setShape(sim, top, left, shape);
}


/*
  Create a down+left glider shape in the passed in sim at the location specified
*/
function createDownLeftGlider(sim, top, left) {
  let shape = [
    [true, false, true],
    [true, false, false],
    [true, true,  false]
  ];
  setShape(sim, top, left, shape);
}


/*
  Create a up+left glider shape in the passed in sim at the location specified
*/
function createUpLeftGlider(sim, top, left) {
  let shape = [
    [true, true, false],
    [true, false, false],
    [true, false, true]
  ];
  setShape(sim, top, left, shape);
}


/*
  Create a up+right glider shape in the passed in sim at the location specified
*/
function createUpRightGlider(sim, top, left) {
  let shape = [
    [false, true, true],
    [false, false, true],
    [true,  false, true]
  ];
  setShape(sim, top, left, shape);
}

/*
  Create a gosper glider gun!
*/
function createGGG(sim, top, left) {
  let shape = [
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false ],
    [ false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,true,false,true,true,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
    [ false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ]
  ];

  setShape(sim, top, left, shape);
}
