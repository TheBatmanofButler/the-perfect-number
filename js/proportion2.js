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
  squares: []
}

let canvases = [];

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

let updatePropGraphParam = function (param, value) {
  propGraphParams[param] = value;
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
  let propWidth = $('.proportion-graph-wrapper').width(),
      propHeight = $('.proportion-graph-wrapper').height(),
      numSquares = propGraphParams['regions'][0]['numSquares']
      squareOuterLength = getSquareOuterLength(propWidth, propHeight, numSquares),
      rowLength = Math.floor(propHeight / squareOuterLength),
      squares = getGridSquares(numSquares, squareOuterLength, rowLength);

  updatePropGraphParam('propWidth', propWidth);
  updatePropGraphParam('propHeight', propHeight);
  updatePropGraphParam('numSquares', numSquares);
  updatePropGraphParam('squareOuterLength', squareOuterLength);
  updatePropGraphParam('rowLength', rowLength);
  updatePropGraphParam('squares', squares);


  let canvas = d3.select('.proportion-graph')
                 .attr('width', propWidth)
                 .attr('height', propHeight);

  setAllRegionSquares();
  createAllCanvases();

  for (let ii = 0; ii < canvases.length; ii++) {
    setTimeout(function () {
      addCanvas(canvases[ii]);
    }, ii * 1000);
  }

}

let createAllCanvases = function () {
  let regions = propGraphParams['regions'],
      propWidth = propGraphParams['propWidth'],
      propHeight = propGraphParams['propHeight'],
      squareLength = propGraphParams['squareOuterLength'],
      rowLength = propGraphParams['rowLength'];

  let canvasObj;
  for (let ii in regions) {
    let canvas = document.createElement('canvas');
    canvases.push(canvas);
    
    canvasObj = d3.select(canvas)
                  .attr('width', propWidth)
                  .attr('height', propHeight);

    drawRegion(canvas, regions[ii]);
  }

  canvasObj
    .call(addMouseEvent);
    
}

let addMouseEvent = function (canvasObj) {
  canvasObj
    .on('mousemove', function() {
      let mouseX = d3.event.offsetX,
          mouseY = d3.event.offsetY,
          column = Math.floor(mouseX / squareOuterLength),
          row = Math.floor(mouseY / squareOuterLength),
          sqId = column * rowLength + row;
      console.log(sqId);
    });
}

let checkHoverMap = function () {
  let hoverMap = {},
      regions = propGraphParams['regions'];

  for (let ii = regions.length - 1; ii > -1; ii--) {
    let region = regions[ii];

    for (let jj in region) {
      hoverMap[jj] = ii;
    }
  }

  console.log()
}

let addCanvas = function (canvas) {
  $(canvas).css('opacity', '0');
  $('.proportion-graph-wrapper').append(canvas);
  $(canvas).animate({'opacity': '1'}, 'slow');
}

let removeCanvas = function (canvas) {
  $(canvas).animate({'opacity': '0'}, 'slow');
}

let changeColorOpacity = function (color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let drawRegion = function (canvas, region) {
  let squareOuterLength = propGraphParams['squareOuterLength'];

  ctx = canvas.getContext('2d');

  squares = region['squares'];

  ctx.fillStyle = region['color'];
  for (let i = 0; i < squares.length; ++i) {
    const point = squares[i];
    let squareSpacing = Math.floor(squareOuterLength / 5),
        squareInnerLength = squareOuterLength - squareSpacing;

    ctx.fillRect(point.x,
                 point.y,
                 squareInnerLength,
                 squareInnerLength);
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