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
  let squareSpacing = 0.4,
      squareLength,
      sx = getSquareLengthHelper(height, width, numSquares),
      sy = getSquareLengthHelper(width, height, numSquares);

  squareLength = Math.max(parseFloat(sx.toFixed(1)),parseFloat(sy.toFixed(1)));
  
  return squareLength;
}

let createProportionGraph = function (companyKey, noRedo) {
  let proportionWidth = $('.proportion-graph-wrapper').width(),
      proportionHeight = $('.proportion-graph-wrapper').height(),
      canvas = d3.select('.proportion-graph')
        .attr('width', proportionWidth)
        .attr('height', proportionHeight);
  console.log(proportionHeight);
  let regions = comparisonData[companyKey].sort(function (a, b) {
    return b['numSquares'] - a['numSquares'];
  });

  drawProportionGraph(regions, proportionWidth, proportionHeight, noRedo);
}

let drawProportionGraph = function (regions, proportionWidth, proportionHeight, noRedo) {
  let numSquares = regions[0]['numSquares'],
      squareLength = getSquareLength(proportionWidth, proportionHeight, numSquares),
      rowLength = Math.floor(proportionHeight / squareLength),
      points = getGridPoints(numSquares, squareLength, rowLength);

  // drawCanvas(points, squareLength, proportionWidth, proportionHeight);
  getAllRegionSquares(regions, rowLength);
  
  if(noRedo)
    updateRegionsColorText(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);
  else
    drawRegions(regions, points, squareLength, rowLength, proportionWidth, proportionHeight);

  bindMouseEvent(points, squareLength, rowLength, regions, proportionWidth, proportionHeight);
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

  let sqId;
  for (let i = 0; i < numOfSq; i++) {
    sqId = startSquareId + i;
    if (direction==1) {
      region['squares'].push(sqId);
      if((sqId + 1) % rowLength == 0)
        direction = 2;
    }
    else {
      newSqId = (Math.floor(sqId/rowLength) + 1)  * rowLength - (sqId % rowLength) - 1;
      region['squares'].push(newSqId);
      if((sqId + 1) % rowLength == 0)
        direction = 1;
    } 
  }
  // if((sqId) % rowLength == 0)
  //   return !direction;
  return direction;
}

let shuffleArray = function(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

let updateRegionsColorText = function (regions, points, squareLength, rowLength, proportionWidth, proportionHeight) {
  for (let i in regions) {
    let region = regions[i];
    let regionSquareIds = region['squares'];
    for (let j in regionSquareIds) {
      let squareId = regionSquareIds[j];
      updateSquareColor(points, squareId, region['color']);
      updateSquareText(points, squareId,region['text'], region['money']);
    }
  }
  drawCanvas(points, squareLength, proportionWidth, proportionHeight);
}

let drawRegionColorText = function (region, points, color, squareLength, proportionWidth, proportionHeight) {
  let canvas = d3.select('.proportion-graph');
  let ctx = canvas.node().getContext('2d');
  let regionSquareIds = shuffleArray(region['squares']);
  let count = 0;
    for (let j in regionSquareIds) {
      let squareId = regionSquareIds[j];
      let point = points[squareId];
      updateSquareColor(points, squareId, color);
      updateSquareText(points, squareId,region['text'],region['money']);
      setTimeout(function() {
        // drawBorder(ctx, point.x, point.y, squareLength, squareLength, '#fff', 0.4);
        ctx.fillStyle = point.color;
        ctx.fillRect(point.x, point.y, squareLength, squareLength);
        ctx.lineWidth = 0.4;
        ctx.strokeStyle = "white";
        ctx.strokeRect(point.x, point.y, squareLength, squareLength);
      }, 150/regionSquareIds.length * count);
      count++;
    }
}

let drawRegions = function (regions, points, squareLength, rowLength, proportionWidth, proportionHeight) {
  let count = 0;
  for (let i in regions) {
    let region = regions[i];
    setTimeout(function() {
        drawRegionColorText(region, points, region['color'], squareLength, proportionWidth, proportionHeight);
    }, 1000 * count);
    count++;
  }
  drawCanvas(points, squareLength, proportionWidth, proportionHeight);
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
      addToolTip(points[sqId]['text'], points[sqId]['money'], mouseX, mouseY);
    }      
  });
  $('.proportion-graph').mouseleave(function() {
    updateRegionsColorText(regions, points, squareLength, rowLength, proportionWidth, proportionHeight); 
  });
}

let changeColorOpacity = function (color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let addToolTip = function (text, money, x, y) {
  let canvas = d3.select('.proportion-graph');
  let ctx = canvas.node().getContext('2d'); 
  ctx.fillRect(x + 5, y + 5, ctx.measureText(text).width, ctx.measureText(text).height);
  ctx.font = 'bold 15px arial';
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + 10, y + 15, 160);
  ctx.fillText(money, x + 10, y + 30, 160);
}

let drawHoveredRegions = function (regions, points, squareLength, proportionWidth, proportionHeight, hoveredRegionText) {
  let hoveredRegionSquareIds;
  let regionSquareIds;
  let i = 0;
  let region = regions[i];

  while (region['text'] != hoveredRegionText) {
    regionSquareIds = region['squares'];
    for (let j in regionSquareIds) {
      let squareId = regionSquareIds[j];
      updateSquareColor(points, squareId, changeColorOpacity(region['color'],0.2));     
    }
    region = regions[i++];
  }
  regionSquareIds = region['squares'];
  for (let j in regionSquareIds) {
    let squareId = regionSquareIds[j];
    updateSquareColor(points, squareId, region['color']);     
  }
  drawCanvas(points, squareLength, proportionWidth, proportionHeight);
}

let updateSquareText = function (points, squareId, text, money) {
  points[squareId]['text'] = text;
  points[squareId]['money'] = money;
}

let updateSquareColor = function (points, squareId, color) {
  points[squareId]['color'] = color;
}

let drawCanvas = function (points, squareLength, proportionWidth, proportionHeight) {
  return new Promise( function (resolve, reject) {
    let canvas = d3.select('.proportion-graph');
    let ctx = canvas.node().getContext('2d');
    ctx.save();

    ctx.clearRect(0, 0, proportionWidth, proportionHeight);

    for (let i = 0; i < points.length; ++i) {
      let point = points[i];
      // drawBorder(ctx, point.x, point.y, squareLength, squareLength, '#fff', 0.4);
      ctx.fillStyle = point.color;
      ctx.fillRect(point.x, point.y, squareLength, squareLength);
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = "white";
      ctx.strokeRect(point.x, point.y, squareLength, squareLength);
    }
    ctx.restore();
    resolve();
  });
}

let drawBorder = function (ctx, xPos, yPos, width, height, borderColor, thickness) {
  ctx.fillStyle = borderColor;
  ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}