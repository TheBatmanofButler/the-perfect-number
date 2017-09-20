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
  gridDiv = document.getElementById('grid');
  width = gridDiv.clientWidth;
  height = gridDiv.clientHeight;

  cellSize = Math.floor(Math.sqrt((width*height)/numPoints));
  
  if (cellSize < 5) { cellSpacing = 0.3; }
  else { cellSpacing = 1;}
  
  var squaresRow = Math.floor(height / (cellSize+cellSpacing));
  var squaresColumn = Math.floor(numPoints/squaresRow);

  while(squaresColumn*(cellSize+cellSpacing)>width) { cellSize-=1; }
  
  points.forEach((point, i) => {
    point.x = (cellSize+cellSpacing) * Math.floor(i / squaresRow);
    point.y = (cellSize+cellSpacing) * (i % squaresRow);
  });
  console.log(points)
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
  changeAreaColor(points, 0, possibleComparisons[0].money,possibleComparisons[0].color);
  changeAreaColor(points, 0, possibleComparisons[1].money,possibleComparisons[1].color);
  var prevSquareId = 0;
  for (let i = 2; i < possibleComparisons.length; i++) {

    setTimeout(function() {
        changeAreaColor(points, prevSquareId, possibleComparisons[i].money,possibleComparisons[i].color);
        prevSquareId += possibleComparisons[i].money;
    }, 1000 * i);
  };
}

var allCompaniesPanel = function () {
  var possibleComparisons = [
    {
      'text': 'Total Tax if rate is 35%',
      'money': total35,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'text': 'All Companies Tax Break',
      'money': totalTaxBreaks,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  var totalSquares = 0;
  for (let i = 0; i < globalComparison.length; i++) {
    var squares = Math.floor(globalComparison[i].money / 1000000);
    if(squares >=5  && squares <= totalTaxBreaks-totalSquares) {
      possibleComparisons.push({
        'text': globalComparison[i].text,
        'money': squares,
        'color': globalComparison[i].color
      })
      totalSquares += squares;
    }
  };
  possibleComparisons = possibleComparisons.sort(function (a, b) {return a.money < b.money});
  visualise(possibleComparisons);
}

var companiesPanel = function (company35TaxSquares, companyTaxBreaksSquares) {
  var possibleComparisons = [
    {
      'text': 'Company Tax if rate is 35%',
      'money': company35TaxSquares,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'text': 'Company Tax Break',
      'money': companyTaxBreaksSquares,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  var totalSquares = 0;
  for (let i = 0; i < globalComparison.length; i++) {
    var squares = Math.floor(globalComparison[i].money / 1000000);
    if(squares >=5  && squares <= companyTaxBreaksSquares-totalSquares) {
      possibleComparisons.push({
        'text': globalComparison[i].text,
        'money': squares,
        'color': globalComparison[i].color
      })
      totalSquares += squares;
    }
  };
  possibleComparisons = possibleComparisons.sort(function (a, b) {return a.money < b.money});
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
