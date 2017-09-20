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

var canvas = d3.select('.grid')
    .append('canvas')
    .attr('class','prop-canvas');

var gridLayout = function(points) {
  gridDiv = $('.grid');
  width = gridDiv.width();
  height = gridDiv.height();
  cellSize = Math.floor(Math.sqrt((width*height)/numPoints));
  
  if (cellSize < 5) { cellSpacing = 0.3; }
  else { cellSpacing = 1;}
  
  // squaresColumn = Math.floor(width / (cellSize+cellSpacing));
  var squaresRow = Math.floor(height / (cellSize+cellSpacing));
  var squaresColumn = Math.floor(numPoints/squaresRow);
  // while((squaresColumn)*(squaresRow)<numPoints) {
  //   cellSize-=1;
  //   // squaresColumn = Math.floor(width /  (cellSize+cellSpacing));
  //   squaresRow = Math.floor(height /  (cellSize+cellSpacing));
  //   squaresColumn = Math.floor(numPoints/squaresRow);
  // }
  while(squaresColumn*(cellSize+cellSpacing)>width) { cellSize-=1; }
  console.log('cellSize: ' + cellSize);
  // console.log('numPoints: ' + numPoints);
  console.log('squaresColumn: ' + squaresColumn);
  console.log('squaresRow: ' + squaresRow);
  
  points.forEach((point, i) => {
    point.x = (cellSize+cellSpacing) * Math.floor(i / squaresRow);
    point.y = (cellSize+cellSpacing) * (i % squaresRow);
  });

  return points;
}

var createProportionGraph = function (noOfSquares) {

  numPoints = noOfSquares;
  console.log('numPoints: ' + numPoints);
  // generate the array of points with a unique ID and color
  points = d3.range(1,numPoints+1).map(index => ({
    id: index,
    color: "rgba(0, 0, 0, 0.3)"
  }));

  console.log(points);

  gridLayout(points);
  canvas
    .attr('width', width)
    .attr('height', height);
  drawCanvas(canvas);
  d3.select('.propCanvas').on('mousemove', function() {
    var mouseX = d3.event.offsetX;
    var mouseY = d3.event.offsetY;
    var column = Math.floor(mouseX/(cellSize+cellSpacing));
    var row = Math.floor(mouseY/(cellSize+cellSpacing));
    // console.log (squaresRow);
    // console.log('column: ' + column);
    // console.log('row: ' + row);
    var id;
    id = column * (squaresRow) + row + 1;
    if(id<numPoints) {console.log(id);}
    
  });

}

var visualise = function(possibleComparisons) {
  // createProportionGraph(possibleComparisons[0].length);
  changeAreaColor(points, 0, possibleComparisons[0].val,possibleComparisons[0].color);
  changeAreaColor(points, 0, possibleComparisons[1].val,possibleComparisons[1].color);
  var prevSquareId = 0;
  for (let i = 2; i < possibleComparisons.length; i++) {
    // changeAreaColor(points, 0, possibleComparisons[i].val,possibleComparisons[i].color);
    setTimeout(function() {
        changeAreaColor(points, prevSquareId, possibleComparisons[i].val,possibleComparisons[i].color);
        prevSquareId += possibleComparisons[i].val;
    }, 1000 * i);
  };
}

var allCompaniesPanel = function () {
  var possibleComparisons = [
    {
      'text': 'Total Tax if rate is 35%',
      'val': total35,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'text': 'All Companies Tax Break',
      'val': totalTaxBreaks,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  var totalSquares = 0;
  for (let i = 0; i < globalComparison.length; i++) {
    var squares = Math.floor(globalComparison[i].money / 1000000);
    if(squares >=5  && squares <= totalTaxBreaks-totalSquares) {
      possibleComparisons.push({
        'text': globalComparison[i].text,
        'val': squares,
        'color': globalComparison[i].color
      })
      totalSquares += squares;
    }
  };
  possibleComparisons = possibleComparisons.sort(function (a, b) {return a.val < b.val});
  visualise(possibleComparisons);
}

var companiesPanel = function (company35TaxSquares, companyTaxBreaksSquares) {
  var possibleComparisons = [
    {
      'text': 'Company Tax if rate is 35%',
      'val': company35TaxSquares,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'text': 'Company Tax Break',
      'val': companyTaxBreaksSquares,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  var totalSquares = 0;
  for (let i = 0; i < globalComparison.length; i++) {
    var squares = Math.floor(globalComparison[i].money / 1000000);
    if(squares >=5  && squares <= companyTaxBreaksSquares-totalSquares) {
      possibleComparisons.push({
        'text': globalComparison[i].text,
        'val': squares,
        'color': globalComparison[i].color
      })
      totalSquares += squares;
    }
  };
  possibleComparisons = possibleComparisons.sort(function (a, b) {return a.val < b.val});
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
