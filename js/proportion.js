/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */
var numPoints = 0;
var squaresRow = 0;
var squaresColumn = 0;

var canvas = d3.select('#grid')
    .append('canvas')
    .attr('class','prop-canvas');

var gridLayout = function(points) {
  var gridDiv = document.getElementById('grid');
  width = gridDiv.clientWidth;
  height = gridDiv.clientHeight;

  cellSize = Math.floor(Math.sqrt((width*height)/points.length));
  console.log(width, height, points.length);
  
  if (cellSize < 5) { cellSpacing = 0.3; }
  else { cellSpacing = 1;}
  
  var squaresRow = Math.floor(height / (cellSize+cellSpacing));
  var squaresColumn = Math.floor(numPoints/squaresRow);

  while(squaresColumn*(cellSize+cellSpacing)>width) { cellSize-=1; }
  
  points.forEach((point, i) => {
    point.x = (cellSize+cellSpacing) * Math.floor(i / squaresRow);
    point.y = (cellSize+cellSpacing) * (i % squaresRow);
  });
  return points;
}

var createProportionGraph = function (noOfSquares) {

  numPoints = noOfSquares;

  // generate the array of points with a unique ID and color
  points = d3.range(0,numPoints).map( function(index) {
    return {
      id: index,
      color: "rgba(0, 0, 0, 0.3)"
    }
  });

  gridLayout(points);
  canvas
    .attr('width', width)
    .attr('height', height);
  drawCanvas(canvas);
  d3.select('.prop-canvas').on('mousemove', function() {
    var mouseX = d3.event.offsetX;
    var mouseY = d3.event.offsetY;
    var column = Math.floor(mouseX/(cellSize+cellSpacing));
    var row = Math.floor(mouseY/(cellSize+cellSpacing));
    var id = column * (squaresRow) + row + 1;
  });

}

var visualise = function(possibleComparisons) {
  changeAreaColor(points, 0, possibleComparisons[0]['numSquares'],possibleComparisons[0]['color']);
  changeAreaColor(points, 0, possibleComparisons[1]['numSquares'],possibleComparisons[1]['color']);
  var prevSquareId = 0;
  for (let i = 2; i < possibleComparisons.length; i++) {
    setTimeout(function() {
        changeAreaColor(points, prevSquareId, possibleComparisons[i]['numSquares'],possibleComparisons[i]['color']);
        prevSquareId += possibleComparisons[i]['numSquares'];
    }, 1000 * i-2);
  };
}

var allCompaniesPanel = function (companyKey) {
  var possibleComparisons = globalComparison[companyKey].sort(function (a, b) {
    return b['numSquares'] - a['numSquares'];
  });
  createProportionGraph(possibleComparisons[0]['numSquares']);
  console.log(possibleComparisons)
  visualise(possibleComparisons);
}

var changeSquareColor = function(points, squareId, color) {
  points[squareId].color = color;
}

var changeAreaColor = function(points, startSquareId, numOfSq, color) {
  for (let i = 0; i < numOfSq; i++) {
    changeSquareColor(points, startSquareId + i, color);
  };
  drawCanvas(canvas);
}

var drawCanvas = function(canvas) {
  var ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    var point = points[i];
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, cellSize, cellSize);
  }

  ctx.restore();
}
