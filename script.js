// canvas settings
const width = 600;
const height = 600;

// point settings
const numPoints = 7000;
const pointWidth = 4;
const pointMargin = 3;

// animation settings
const duration = 1500;
const ease = d3.easeCubic;
let timer;
let currLayout = 0;

// create set of points
const points = createPoints(numPoints, pointWidth, width, height);

// wrap layout helpers so they only take points as an argument
const toGrid = (points) => gridLayout(points,
  pointWidth + pointMargin, width);
const toSine = (points) => sineLayout(points,
  pointWidth + pointMargin, width, height);
const toSpiral = (points) => spiralLayout(points,
  pointWidth + pointMargin, width, height);
const toPhyllotaxis = (points) => phyllotaxisLayout(points,
  pointWidth + pointMargin, width / 2, height / 2);

// store the layouts in an array to sequence through
const layouts = [toSine, toPhyllotaxis, toSpiral, toPhyllotaxis, toGrid];

// draw the points based on their current layout
function draw() {
  const ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
  }

  ctx.restore();
}

// animate the points to a given layout
function animate(layout) {
  // store the source position
  points.forEach(point => {
    point.sx = point.x;
    point.sy = point.y;
  });

  // get destination x and y position on each point
  layout(points);

  // store the destination position
  points.forEach(point => {
    point.tx = point.x;
    point.ty = point.y;
  });

  timer = d3.timer((elapsed) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    draw();

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      timer.stop();

      // update to use next layout
      currLayout = (currLayout + 1) % layouts.length;

      // start animation for next layout
      animate(layouts[currLayout]);
    }
  });
}

// create the canvas
const screenScale = window.devicePixelRatio || 1;
const canvas = d3.select('body').append('canvas')
  .attr('width', width * screenScale)
  .attr('height', height * screenScale)
  .style('width', `${width}px`)
  .style('height', `${height}px`)
  .on('click', function () {
    d3.select('.play-control').style('display', '');
    timer.stop();
  });
canvas.node().getContext('2d').scale(screenScale, screenScale);

// start off as a grid
toGrid(points);
draw();

d3.select('body').append('div')
  .attr('class', 'play-control')
  .text('PLAY')
  .on('click', function () {
    // start the animation
    animate(layouts[currLayout]);

    // remove the play control
    d3.select(this).style('display', 'none');
  });