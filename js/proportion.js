/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */

let getSquareLengthHelper = function (p1, p2, numSquares) {
  let pxy = Math.ceil(Math.sqrt(numSquares * p2 / p1));

  if (Math.floor(pxy * p1 / p2) * pxy < numSquares)
    return p1 / Math.ceil(pxy * p1 / p2);
  else
    return p2 / pxy;
}

let getSquareLength = function (width, height, numSquares) {
  let sx = getSquareLengthHelper(height, width, numSquares),
      sy = getSquareLengthHelper(width, height, numSquares);

  return parseFloat(sx.toFixed(1));
}

let createProportionGraph = function (companyKey) {
  let proportionWidth = $('.proportion-graph-wrapper').width(),
      proportionHeight = $('.proportion-graph-wrapper').height(),
      canvas = d3.select('.proportion-graph')
        .attr('width', proportionWidth)
        .attr('height', proportionHeight);

  let regions = comparisonData[companyKey].sort(function (a, b) {
    return b['numSquares'] - a['numSquares'];
  });

  drawProportionGraph(regions, proportionWidth, proportionHeight);
}

let drawProportionGraph = function(regions, proportionWidth, proportionHeight) {
  let numSquares = regions[0]['numSquares'],
      squareLength = getSquareLength(proportionWidth, proportionHeight, numSquares);

  let rowLength = Math.floor(proportionHeight / squareLength),
      points = getGridPoints(numSquares, squareLength, rowLength);

  bindMouseEvent(squareLength, rowLength);
  drawRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);
}

let getGridPoints = function (numSquares, squareLength, rowLength) {
  return d3.range(0, numSquares).map( function(index) {
    return {
      id: index,
      color: 'rgba(0, 0, 0, 0.3)',
      x: squareLength * Math.floor(index / rowLength),
      y: squareLength * (index % rowLength)
    }
  });
}

let bindMouseEvent = function (squareLength, rowLength) {
  d3.select('.proportion-graph').on('mousemove', function() {
    let mouseX = d3.event.offsetX,
      mouseY = d3.event.offsetY,
      column = Math.floor(mouseX / squareLength),
      row = Math.floor(mouseY / squareLength),
      sqId = column * rowLength + row + 1;

      console.log(sqId -1);
  });
}

let drawRegions = function(regions, points, squareLength, rowLength, proportionWidth, proportionHeight) {
  let startSquareId = 0;
  let direction = 1;
  console.log('rowLength: ' + rowLength)

  for (let i = 0; i < regions[0]['numSquares']; i++) {
    updateSquareColor(points, startSquareId + i, regions[0]['color'])
  }

  for (let i = 1; i < regions.length; i++) {
    let region = regions[i],
        numSquares = region['numSquares'];

    direction = updateRegionColor(points, startSquareId, numSquares, region['color'], rowLength, direction);
    drawCanvas(points, squareLength, proportionWidth, proportionHeight);

    if (i > 1)
      startSquareId += numSquares;
  }
}

let updateSquareColor = function(points, squareId, color) {
  points[squareId]['color'] = color;
}

let updateRegionColor = function(points, startSquareId, numOfSq, color, rowLength, direction) {
  for (let i = 0; i < numOfSq; i++) {
    sqId = startSquareId + i;
    if (direction) {
      updateSquareColor(points, sqId, color);
      if((sqId + 1) % rowLength == 0)
        direction = 0;
    }
    else {
      newSqId = (Math.floor(sqId/rowLength) + 1)  * rowLength - (sqId % rowLength);
      updateSquareColor(points, newSqId - 1, color);
      if((sqId + 1) % rowLength == 0)
        direction = 1;
    } 
  }
  return direction;
}

let drawCanvas = function(points, squareLength, proportionWidth, proportionHeight) {
  let canvas = d3.select('.proportion-graph');
  let ctx = canvas.node().getContext('2d');
  ctx.save();

  ctx.clearRect(0, 0, proportionWidth, proportionHeight);

  for (let i = 0; i < points.length; ++i) {
    let point = points[i];
    drawBorder(ctx, point.x, point.y, squareLength, squareLength, '#000', 0.4);
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, squareLength, squareLength);
  }

  ctx.restore();
}

let drawBorder = function(ctx, xPos, yPos, width, height, borderColor, thickness) {
  ctx.fillStyle = borderColor;
  ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}