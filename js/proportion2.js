/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */

let propGraphParams = {
  regions: {},
  propWidth: null,
  propHeight: null,
  squareOuterLength: null,
  rowLength: null,
  squares: [],
  canvases: []
}


let getSquareOuterLengthHelper = function (p1, p2, numSquares) {
  let pxy = Math.ceil(Math.sqrt(numSquares * p2 / p1));

  if (Math.floor(pxy * p1 / p2) * pxy < numSquares)
    return p1 / Math.ceil(pxy * p1 / p2);
  else
    return p2 / pxy;
}

let getSquareOuterLength = function (width, height, numSquares) {
  let sx = getSquareOuterLengthHelper(height, width, numSquares),
      sy = getSquareOuterLengthHelper(width, height, numSquares);

  return Math.floor( Math.max(sx, sy) );
}

let initPropGraph = function (companyName) {

    propGraphParams['regions'] = comparisonData[companyName].sort(function (a, b) {
      return b['numSquares'] - a['numSquares'];
    });
}

let updatePropGraphParams = function () {

  let propWidth = $('.proportion-graph-wrapper').width(),
      propHeight = $('.proportion-graph-wrapper').height(),
      numSquares = propGraphParams['regions'][0]['numSquares']
      squareOuterLength = getSquareOuterLength(propWidth, propHeight, numSquares),
      rowLength = Math.floor(propHeight / squareOuterLength),
      squares = getGridSquares(numSquares, squareOuterLength, rowLength);

      propGraphParams['propWidth'] = propWidth;
      propGraphParams['propHeight'] = propHeight;
      propGraphParams['numSquares'] = numSquares;
      propGraphParams['squareOuterLength'] = squareOuterLength;
      propGraphParams['rowLength'] = rowLength;
      propGraphParams['squares'] = squares;
}

let getGridSquares = function (numSquares, squareOuterLength, rowLength) {
  return d3.range(0, numSquares).map( function(index) {
    return {
      id: index,
      x: squareOuterLength * Math.floor(index / rowLength),
      y: squareOuterLength * (index % rowLength)
    }
  });
}

let updatePropGraph = function () {

  updatePropGraphParams();
  setAllRegionSquares();
  getHoverMap();
  createCanvases();

  addCanvas(0);
  showCanvas(0);
  drawRegion(0);
  addCanvas(1);
  showCanvas(1);
  animateCanvas(1);

}

let shuffleArray = function(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

let createCanvases = function () {
  let regions = propGraphParams['regions'],
      propWidth = propGraphParams['propWidth'],
      propHeight = propGraphParams['propHeight'],
      canvases = propGraphParams['canvases'] = [];

  d3.selectAll('canvas').remove();

  let canvasObj;
  for (let ii in regions) {
    let canvas = document.createElement('canvas');
    canvases.push(canvas);
    
    canvasObj = d3.select(canvas)
                  .attr('class', function (d) {
                    if (ii == 1)
                      return 'animated';
                    else
                      return 'non-animated';
                  })
                  .attr('width', propWidth)
                  .attr('height', propHeight);
  }

  canvasObj
    .call(addMouseEvent);
}

let addMouseEvent = function (canvasObj) {
  let hoverMap = propGraphParams['hoverMap'],
      regions = propGraphParams['regions'],
      numSquares = propGraphParams['numSquares'];

  canvasObj
    .on('mousemove', function() {
      let mouseX = d3.event.offsetX,
          mouseY = d3.event.offsetY,
          column = Math.floor(mouseX / squareOuterLength),
          row = Math.floor(mouseY / squareOuterLength),
          squareId = column * rowLength + row;
      if (squareId < numSquares)
        showProperRegion(squareId);
      else
        showAllRegions();
    })
    .on('mouseout', function () {
      showAllRegions();
    });
}

let getHoverMap = function () {
  let hoverMap = propGraphParams['hoverMap'] = {},
      regions = propGraphParams['regions'];

  for (let ii = regions.length - 1; ii > -1; ii--) {
    let region = regions[ii],
        regionSquares = region['squares'];

    for (let jj in regionSquares) {
      let square = regionSquares[jj],
          squareId = square['id'];

      if (!hoverMap.hasOwnProperty(squareId))
        hoverMap[squareId] = ii;
    }
  }
}

let showProperRegion = function (squareId) {
  let hoverMap = propGraphParams['hoverMap'],
      regionId = hoverMap[squareId];

      if (regionId == 0)
        show35PercentRegion();

      else if (regionId == 1)
        showTaxBreakRegion();

      else
        showComparisonRegion(regionId);
}

let showAllRegions = function () {
  let canvases = propGraphParams['canvases'];

  for (let ii = 0; ii < canvases.length; ii++)
    showCanvas(canvases[ii]);
}

let show35PercentRegion = function () {
  let canvases = propGraphParams['canvases'];

  showCanvas(canvases[0]);
  for (let ii = 1; ii < canvases.length; ii++)
    hideCanvas(canvases[ii]);
}

let showTaxBreakRegion = function () {
  let canvases = propGraphParams['canvases'];

  showCanvas(canvases[1]);
  makeCanvasOpaque(canvases[0], 0.3)

  for (let ii = 2; ii < canvases.length; ii++)
    hideCanvas(canvases[ii]);
}

let showComparisonRegion = function (canvasId) {
  let canvases = propGraphParams['canvases'];

  for (let ii = 0; ii < canvases.length; ii++) {
    if (ii == canvasId)
      showCanvas(canvases[ii]);
    else
      makeCanvasOpaque(canvases[ii]);
  }
}

let addCanvas = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .style('opacity', '0');
  $('.proportion-graph-wrapper').append(canvas);
}

let showCanvas = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .transition()
    .style('opacity', '1');
}

let hideCanvas = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .transition()
    .style('opacity', '0');
}

let makeCanvasOpaque = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .transition()
    .style('opacity', '0.3');
}

let changeOpacity = function (color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let drawRegion = function (regionId) {
  let canvases = propGraphParams['canvases'],
      regions = propGraphParams['regions'],
      canvas = canvases[regionId],
      region = regions[regionId],
      squareOuterLength = propGraphParams['squareOuterLength'],
      ctx = canvas.getContext('2d'),
      squares = region['squares'];

  ctx.fillStyle = region['color'];
  for (let i = 0; i < squares.length; ++i) {
    const point = squares[i];
    let squareSpacing = Math.floor(squareOuterLength / 3),
        squareInnerLength = squareOuterLength - squareSpacing;

    ctx.fillRect(point.x,
                 point.y,
                 squareInnerLength,
                 squareInnerLength);
  }
}

let animateCanvas = function (regionId) {
  let canvases = propGraphParams['canvases'],
      squareOuterLength = propGraphParams['squareOuterLength'],
      canvas = canvases[regionId],
      region = propGraphParams['regions'][regionId],
      squares = shuffleArray(region['squares']);

  let ctx = canvas.getContext('2d');

  ctx.fillStyle = region['color'];
  for (let i = 0; i < squares.length; ++i) {
    const point = squares[i];
    let squareSpacing = Math.floor(squareOuterLength / 3),
        squareInnerLength = squareOuterLength - squareSpacing;

    setTimeout(function() {
      ctx.fillRect(point.x,
                   point.y,
                   squareInnerLength,
                   squareInnerLength);
    }, 0.01 * i);
  }
}

let setAllRegionSquares = function () {

  let startSquareId = 0,
      direction = 1,
      regions = propGraphParams['regions'],
      squareOuterLength = propGraphParams['squareOuterLength'],
      rowLength = propGraphParams['rowLength'];

  for (let ii = 0; ii < regions.length; ii++) {
    let region = regions[ii],
        numSquares = region['numSquares'];

    if (ii < 2) {
      region['squares'] = d3.range(0, numSquares).map( function(index) {
                            return {
                              id: index,
                              x: squareOuterLength * Math.floor(index / rowLength),
                              y: squareOuterLength * (index % rowLength)
                            }
                          });
    }
    else
      direction = setSubregionSquares(region, numSquares, startSquareId, direction);

    if (ii > 1)
      startSquareId += numSquares;
  }
}

let setSubregionSquares = function (region, numSquares, startSquareId, direction) {
  region['squares'] = [];

  let squares = propGraphParams['squares'],
      regionSquares = region['squares'],
      rowLength = region['rowLength'];

  for (let ii = 0; ii < numSquares; ii++) {
    let squareId = startSquareId + ii;

    if (direction == 1) {
      
      let square = getSquareObject(squareId);
      regionSquares.push(square);

      if ((squareId + 1) % rowLength == 0)
        direction = 2;
    }
    else {
      
      let newSquareId = (Math.floor(squareId / rowLength) + 1)  * rowLength - (squareId % rowLength) - 1,
          square = getSquareObject(newSquareId);

      regionSquares.push(square);
      
      if ((squareId + 1) % rowLength == 0)
        direction = 1;
    } 
  }
  return direction;
}

let getSquareObject = function (index) {
  let squareOuterLength = propGraphParams['squareOuterLength'],
      rowLength = propGraphParams['rowLength'];

  return {
    id: index,
    x: squareOuterLength * Math.floor(index / rowLength),
    y: squareOuterLength * (index % rowLength)
  }
}