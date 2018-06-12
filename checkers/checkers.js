// Main Entry Point:
document.addEventListener("DOMContentLoaded", function(event) {
  let pixelSize = 5;
  let roundDelay = 50;
  let chanceOfLife = .01;

  let container = document.getElementById('container');
  let containerWidth = window.innerWidth * .98;
  let containerHeight = window.innerHeight * .98;
  let cols = containerWidth / pixelSize;
  let rows = containerHeight / pixelSize;
  let checkerSize = 20;
  container.style.height = containerHeight + 'px';
  container.style.width = containerWidth + 'px';

  let sim = createGridLockSim(rows, cols, pixelSize, roundDelay, chanceOfLife, checkerSize);
  container.append(sim.canvas);

  sim.repaint();
  sim.start();
  window.addEventListener('keydown', (e) => {
    if(sim.intervalId && e.which === 90) {
      sim.stop();
    }
    else if(e.which === 90) {
      sim.start();
    }
  });


  // Capture mouse state for click and drag features
    sim.canvas.addEventListener('click', (e) => {
    e.preventDefault();
    let rect = e.target.getBoundingClientRect();
    let x, y;
    if(e.touches) {
      let rect = e.target.getBoundingClientRect();
      x = Math.floor((e.touches[0].pageX - rect.left) / pixelSize);
      y = Math.floor((e.touches[0].pageY - rect.top) / pixelSize);
    }
    else {
      x = Math.floor(e.offsetX / pixelSize);
      y = Math.floor(e.offsetY / pixelSize);
    }

    // Find boundaries of the checker square
    let checkerTop = Math.floor(y / checkerSize) * checkerSize;
    let checkerLeft = Math.floor(x / checkerSize) * checkerSize;
    sim.resetLifeWithin(checkerTop, checkerTop + checkerSize, checkerLeft, checkerLeft + checkerSize, 0);
  });
});
