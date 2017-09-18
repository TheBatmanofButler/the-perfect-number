/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */
numPoints = 0;
squaresRow = 0;
squaresColumn =0;

canvas = d3.select('#grid')
    .append('canvas')
    
var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
  // $('.arrow>img').show(1000);
}

var closeProportionGraph = function () {
  // $('.arrow>img').hicde(1000);
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

var gridLayout = function(points) {
  var gridDiv = document.getElementById("grid");
  width = gridDiv.clientWidth;
  height = gridDiv.clientHeight;
  cellSize = Math.floor(Math.sqrt((width*height)/numPoints));
  
  if (cellSize < 5) { cellSpacing = 0.3; }
  else { cellSpacing = 1;}
  
  squaresColumn = Math.floor(width / (cellSize+cellSpacing));
  squaresRow = Math.floor(height / (cellSize+cellSpacing));
  while(squaresColumn*squaresRow<numPoints) {
    cellSize-=1;
    squaresColumn = Math.floor(width /  (cellSize+cellSpacing));
    squaresRow = Math.floor(height /  (cellSize+cellSpacing));
  }
  
  points.forEach((point, i) => {
    point.x = (cellSize+cellSpacing) * Math.floor(i / squaresRow);
    point.y = (cellSize+cellSpacing) * (i % squaresRow);
  });

  return points;
}

var draw = function(canvas) {
  const ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, cellSize, cellSize);
  }

  ctx.restore();
}

var changeSquareColor = function(points, id, color) {
  points[id].color = color;
}

var changeAreaColor = function(points, rowNum, columnNum, noOfSquares, color) {
  var id = columnNum*squaresRow+rowNum;
  for (var i = 0; i < noOfSquares; i++) {
    changeSquareColor(points,id+i,color);
  };
  draw(canvas);
}

var createProportionGraph = function (noOfSquares) {

  numPoints = noOfSquares;
  // generate the array of points with a unique ID and color
  points = d3.range(numPoints).map(index => ({
    id: index,
    color: "rgba(0, 0, 0, 0.3)"
  }));

  gridLayout(points);
  canvas
    .attr('width', width)
    .attr('height', height);
  draw(canvas);
}