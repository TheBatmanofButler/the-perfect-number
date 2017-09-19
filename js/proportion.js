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
    .attr('class','propCanvas');


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
  
  // squaresColumn = Math.floor(width / (cellSize+cellSpacing));
  squaresRow = Math.floor(height / (cellSize+cellSpacing));
  squaresColumn = Math.floor(numPoints/squaresRow);
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

var draw = function(canvas) {
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

var changeSquareColor = function(points, id, color, prevColor) {
  // var i = d3.interpolateLab(prevColor, color);
  // var setColor = function setColor(val) {
  //   console.log(val);
  //   points[id].color = val; 
  // }
  // var x = 0;
  // var t = d3.interval(function() {
  //   if (x < 1) {
  //     x += 0.1;
  //     setColor(i(x));
  //     draw(canvas);
  //   } 
  // }, 100);
  console.log(id);
  points[id].color = color;
}

var changeAreaColor = function(points, id, numOfSq, color, prevColor) {
  // var id = columnNum*squaresRow+rowNum;
  var id = Math.floor(id);
  console.log(numOfSq)
  for (var i = 0; i < numOfSq; i++) {
    changeSquareColor(points,id+i,color, prevColor);
  };
  draw(canvas);
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
  draw(canvas);
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
    // if(id<numPoints) {console.log(id);}
    
  });
  

}

var visualise = function(comparisonMap) {
  var comparisonMap = comparisonMap.sort(function (a, b) {return a.val < b.val});
  // createProportionGraph(comparisonMap[0].length);
  for (let i = 0; i < 1; i++) {
    // changeAreaColor(points, 0, comparisonMap[i].val,comparisonMap[i].color);
    setTimeout(function() {
        var prev = i-1;
        var prevColor;
        if(prev<0) { prevColor = "rgba(0, 0, 0, 0.3)"}
        else { prevColor = comparisonMap[prev].color}
        changeAreaColor(points, 0, comparisonMap[i].val,comparisonMap[i].color,prevColor);
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
    if(boxes>=5 && boxes<totalTaxBreaks) {
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
    if(boxes>=5 && boxes<totalTaxBreaks) {
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

