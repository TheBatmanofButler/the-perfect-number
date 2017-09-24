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

let drawProportionGraph = function (regions, proportionWidth, proportionHeight) {
  let numSquares = regions[0]['numSquares'],
      squareLength = getSquareLength(proportionWidth, proportionHeight, numSquares),
      rowLength = Math.floor(proportionHeight / squareLength),
      points = getGridPoints(numSquares, squareLength, rowLength);

  // drawCanvas(points, squareLength, proportionWidth, proportionHeight);
  getAllRegionSquares(regions, rowLength);
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

let getAllRegionSquares = function (regions, rowLength) {
  let startSquareId = 0;
  let direction = 1;
  let region = regions[0];
  getRegionSquares(region, startSquareId, region['numSquares'], rowLength);

  for (let i = 1; i < regions.length; i++) {
    let region = regions[i],
        numSquares = region['numSquares'];

    direction = getRegionSquares(region, startSquareId, numSquares, rowLength, direction)

    if (i > 1)
      startSquareId += numSquares;
  }
}

let getRegionSquares = function (region, startSquareId, numOfSq, rowLength, direction) {
  region['squares'] = [];
  if(!direction) {
    for (let i = 0; i < numOfSq; i++) 
      region['squares'].push(i);
    return 1;
  }

  for (let i = 0; i < numOfSq; i++) {
    let sqId = startSquareId + i;
    if (direction) {
      region['squares'].push(sqId);
      if((sqId + 1) % rowLength == 0)
        direction = 0;
    }
    else {
      newSqId = (Math.floor(sqId/rowLength) + 1)  * rowLength - (sqId % rowLength) - 1;
      region['squares'].push(newSqId);
      if((sqId + 1) % rowLength == 0)
        direction = 1;
    } 
  }
  return direction;
}

let shuffleArray = function(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

let updateRegionColorText = function (region, points, color) {
  let regionSquareIds = shuffleArray(region['squares']);
    for (let j in regionSquareIds) {
      let squareId = regionSquareIds[j];
      updateSquareColor(points, squareId, color);
      updateSquareText(points, squareId,region['text']);
    }
}

let drawRegions = function (regions, points, squareLength, rowLength, proportionWidth, proportionHeight) {
  for (let i in regions) {
    let region = regions[i];
    updateRegionColorText(region, points, region['color']);
    drawCanvas(points, squareLength, proportionWidth, proportionHeight);
  }
  bindMouseEvent(points, squareLength, rowLength, regions, proportionWidth, proportionHeight);

}

let bindMouseEvent = function (points, squareLength, rowLength, regions, proportionWidth, proportionHeight) {
  d3.select('.proportion-graph').on('mousemove', function() {
    let mouseX = d3.event.offsetX,
        mouseY = d3.event.offsetY,
        column = Math.floor(mouseX / squareLength),
        row = Math.floor(mouseY / squareLength),
        sqId = column * rowLength + row;
    if(sqId < regions[0]['numSquares']) {
      drawHoveredRegions(regions, points, squareLength, proportionWidth, proportionHeight, points[sqId]['text']);
      addToolTip(points[sqId]['text'], mouseX, mouseY);
    }      
  });
  $('.proportion-graph').mouseleave(function() {
      drawRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);
  });
}

let changeColorOpacity = function (color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let addToolTip = function (text, x, y) {
  let canvas = d3.select('.proportion-graph');
  let ctx = canvas.node().getContext('2d');
  ctx.fillStyle = '#222';  
  ctx.fillRect(x + 5, y + 5, ctx.measureText(text).width, ctx.measureText(text).height);
  ctx.font = 'bold 15px arial';
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + 10, y + 20, 160);
}

let drawHoveredRegions = function (regions, points, squareLength, proportionWidth, proportionHeight, hoveredRegion) {
  for(let i in regions) {
    let region = regions[i];
    let color;
    if(region['text'] != hoveredRegion) 
      color = changeColorOpacity(region['color'],0.3);
    else
      color = region['color'];
    
    updateRegionColorText(region, points, color);
  }
  drawCanvas(points, squareLength, proportionWidth, proportionHeight);
}

let updateSquareText = function (points, squareId, text) {
  points[squareId]['text'] = text;
}

let updateSquareColor = function (points, squareId, color) {
  points[squareId]['color'] = color;
}

let drawCanvas = function (points, squareLength, proportionWidth, proportionHeight) {
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

let drawBorder = function (ctx, xPos, yPos, width, height, borderColor, thickness) {
  ctx.fillStyle = borderColor;
  ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}