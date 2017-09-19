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
  // $('.arrow>img').hide(1000);
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

var changeAreaColor = function(points, id, noOfSquares, color) {
  // var id = columnNum*squaresRow+rowNum;
  id = Math.floor(id);
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

var visualise = function(comparisonMap) {
  comparisonMap = comparisonMap.sort(function (a, b) {return a.val < b.val});
  for (let i = 0; i < comparisonMap.length; i++) {
    // changeAreaColor(points, 0, comparisonMap[i].val,comparisonMap[i].color);
    setTimeout(function() {
        changeAreaColor(points, 0, comparisonMap[i].val,comparisonMap[i].color);
    }, 1000 * i);
  };
}

var allCompaniesPanel = function () {
  var comparisonMap = [
    {
      'val': total35,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'val': totalTaxBreaks,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  for (var i = 0; i < globalComparison.length; i++) {
    var boxes = globalComparison[i].money/1000000000
    if(boxes>=5 && boxes<total35+1000) {
      comparisonMap.push({
          'val': boxes,
          'color': globalComparison[i].color
        })
    }
  };
  visualise(comparisonMap);
}

var companiesPanel = function (total35,totalTaxBreaks) {
  console.log(globalComparison);
  var comparisonMap = [
    {
      'val': total35,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'val': totalTaxBreaks,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]
  for (var i = 0; i < globalComparison.length; i++) {
    var boxes = globalComparison[i].money/1000000
    console.log(globalComparison[i].text + ' ,boxes: ' + boxes);
    if(boxes>=5 && boxes<total35+1000) {
      console.log(globalComparison[i].text)
      console.log('boxes: ' + boxes);
      comparisonMap.push({
          'val': boxes,
          'color': globalComparison[i].color
        })
    }
  };
  visualise(comparisonMap);
}