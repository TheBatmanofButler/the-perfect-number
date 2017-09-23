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

  // drawCanvas(points, squareLength, proportionWidth, proportionHeight);
  drawRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);
}

let getGridPoints = function (numSquares, squareLength, rowLength) {
  return d3.range(0, numSquares).map( function(index) {
    return {
      id: index,
      color: 'rgba(0,0,0,0.3)',
      x: squareLength * Math.floor(index / rowLength),
      y: squareLength * (index % rowLength)
    }
  });
}

let bindMouseEvent = function (points, squareLength, rowLength, regions, proportionWidth, proportionHeight) {
  d3.select('.proportion-graph').on('mousemove', function() {
    let mouseX = d3.event.offsetX,
      mouseY = d3.event.offsetY,
      column = Math.floor(mouseX / squareLength),
      row = Math.floor(mouseY / squareLength),
      sqId = column * rowLength + row + 1;
      if(sqId <= regions[0]['numSquares'])
        drawHoveredRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight, points[sqId - 1]['text']);
  });
  // $('.proportion-graph').mouseleave(function() {
  //     drawRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);
  // });
}

let changeColorOpacity = function(color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let drawHoveredRegions = function(regions, points, squareLength, rowLength, proportionWidth, proportionHeight, hoveredRegion) {
  console.log(hoveredRegion);
  let region = regions[0];
  if(region['text']==hoveredRegion) {
    
    for (let i = 0; i < region['numSquares']; i++) {
      updateSquareColor(points, i, region['color']);
    }
  } 
  else {
    for (let i = 0; i < region['numSquares']; i++) {
      updateSquareColor(points, i, changeColorOpacity(region['color'],0.3));
    }
  }
  
  for (let i = 1; i < regions.length; i++) {
    let region = regions[i];
    if(region['text'] == hoveredRegion) 
      updateRegionColorText(points, region['startSquareId'], region['numSquares'], region['color'], region['text'],rowLength, region['direction']);
    else
      updateRegionColorText(points, region['startSquareId'], region['numSquares'], changeColorOpacity(region['color'],0.3), region['text'],rowLength, region['direction']);
  }
  
  drawCanvas(points, squareLength, proportionWidth, proportionHeight);
}

let drawRegions = function(regions, points, squareLength, rowLength, proportionWidth, proportionHeight) {
  let startSquareId = 0;
  let direction = 1;
  let region = regions[0];
  for (let i = 0; i < region['numSquares']; i++) {
    updateSquareColor(points, i, region['color']);
    updateSquareText(points,i, region['text']);
  };
  region['startSquareId'] = startSquareId;
  region['direction'] = 1;

  for (let i = 1; i < regions.length; i++) {
    let region = regions[i],
        numSquares = region['numSquares'];

    regions[i]['startSquareId'] = startSquareId;
    regions[i]['direction'] = direction;

    direction = updateRegionColorText(points, startSquareId, numSquares, region['color'], region['text'],rowLength, direction);
    drawCanvas(points, squareLength, proportionWidth, proportionHeight);

    if (i > 1)
      startSquareId += numSquares;
  }
  bindMouseEvent(points,squareLength, rowLength, regions, proportionWidth, proportionHeight);
}

let updateSquareText = function(points, squareId, text) {
  points[squareId]['text'] = text;
}

let updateSquareColor = function(points, squareId, color) {
  points[squareId]['color'] = color;
}

let updateRegionColorText = function(points, startSquareId, numOfSq, color, text, rowLength, direction) {
  console.log(color);
  for (let i = 0; i < numOfSq; i++) {
    sqId = startSquareId + i;
    if (direction) {
      updateSquareColor(points, sqId, color);
      updateSquareText(points, sqId, text);
      if((sqId + 1) % rowLength == 0)
        direction = 0;
    }
    else {
      newSqId = (Math.floor(sqId/rowLength) + 1)  * rowLength - (sqId % rowLength);
      updateSquareColor(points, newSqId - 1, color);
      updateSquareText(points, newSqId - 1, text);
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
    drawBorder(ctx, point.x, point.y, squareLength, squareLength, '#fff', 0.4);
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, squareLength, squareLength);
  }

  ctx.restore();
}

let drawBorder = function(ctx, xPos, yPos, width, height, borderColor, thickness) {
  ctx.fillStyle = borderColor;
  ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}