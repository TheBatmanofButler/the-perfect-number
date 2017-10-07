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
  columnLength: null,
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
      columnLength = Math.floor(propHeight / squareOuterLength),
      squares = getGridSquares(numSquares, squareOuterLength, columnLength);

      propGraphParams['propWidth'] = propWidth;
      propGraphParams['propHeight'] = propHeight;
      propGraphParams['numSquares'] = numSquares;
      propGraphParams['squareOuterLength'] = squareOuterLength;
      propGraphParams['columnLength'] = columnLength;
      propGraphParams['squares'] = squares;
}

let getGridSquares = function (numSquares, squareOuterLength, columnLength) {
  return d3.range(0, numSquares).map( function(index) {
    return {
      id: index,
      x: squareOuterLength * Math.floor(index / columnLength),
      y: squareOuterLength * (index % columnLength)
    }
  });
}

let updatePropGraph = function (sparkle = true) {

  return Promise.all([
    updatePropGraphParams(),
    setAllRegionSquares(),
    getHoverMap(),
    createCanvases(),
    drawAllCanvases(sparkle)
  ]);

}

let drawAllCanvases = function (sparkle) {
  let regions = propGraphParams['regions'];
  let chain = Promise.resolve();

  for (let regionId in regions) {
    addCanvas(regionId);

    if (regionId == 0) {
      chain = chain.then( function () {
        return Promise.all([
          showCanvas(regionId, 1000),
          drawRegion(regionId),
          showHoverText(regionId)
        ])
      });
    }
    else {
      chain = chain.then( function () {
                return Promise.all([
                  showCanvas(regionId, 1000),
                  showHoverText(regionId)
                ]);
              })
              .then( function () {
                return drawRegion(regionId, sparkle)
              });
    }
  }

  chain = chain.then( function () {
    let unit = propGraphParams['regions'][0]['unit'];
    return changeDynamicText(0, 'Each square is the equivalent of $' + unit);
  })

  return chain;
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
      canvases = propGraphParams['canvases'] = [],
      unit = propGraphParams['regions'][0]['unit'];

  changeDynamicText(0, 'Each square is the equivalent of $' + unit);

  d3.selectAll('canvas')
    // .transition()
    // .duration(300)
    .remove();

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
          squareId = column * columnLength + row;
      if (squareId < numSquares)
        showProperRegion(squareId);
      else {
        showAllRegions();
      }
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

let showHoverText = function (regionId) {
  let region = propGraphParams['regions'][regionId];
  let text = '<b>' + region['text'] + '</b>' + ', ' + region['money'];

  if ($('.dynamic-text').html() != text)
    return changeDynamicText(0, text);
  else
    return Promise.resolve();
}

let showProperRegion = function (squareId) {
  let hoverMap = propGraphParams['hoverMap'],
      regionId = hoverMap[squareId];

  showHoverText(regionId);

  if (regionId == 0)
    showOuterMainRegion();

  else if (regionId == 1)
    showInnerMainRegion();

  else
    showComparisonRegion(regionId);
}

let showAllRegions = function () {
  let canvases = propGraphParams['canvases'],
      unit = propGraphParams['regions'][0]['unit'];
  changeDynamicText(0, 'Each square is the equivalent of $' + unit);

  for (let ii = 0; ii < canvases.length; ii++)
    showCanvas(ii);
}

let showOuterMainRegion = function () {
  let canvases = propGraphParams['canvases'];

  showCanvas(0);
  for (let ii = 1; ii < canvases.length; ii++) {
    hideCanvas(ii);
  }
}

let showInnerMainRegion = function () {
  let canvases = propGraphParams['canvases'];

  showCanvas(1);
  makeCanvasOpaque(0, 0.3)

  for (let ii = 2; ii < canvases.length; ii++) {
    hideCanvas(ii);
  }
}

let showComparisonRegion = function (canvasId) {
  let canvases = propGraphParams['canvases'];

  for (let ii = 0; ii < canvases.length; ii++) {
    if (ii == canvasId)
      showCanvas(ii);
    else
      makeCanvasOpaque(ii);
  }
}

let addCanvas = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .style('opacity', '0');
  $('.proportion-graph-wrapper').append(canvas);
}

let showCanvas = function (canvasId, duration = 100) {
  return new Promise( function (resolve, reject) {
    let canvases = propGraphParams['canvases'],
        canvas = canvases[canvasId];

    d3.select(canvas)
      .transition()
      .duration(duration)
      .style('opacity', '1')
      .end(resolve);
  });
}

let hideCanvas = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .transition()
    .duration(100)
    .style('opacity', '0');
}

let makeCanvasOpaque = function (canvasId) {
  let canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];

  d3.select(canvas)
    .transition()
    .duration(100)
    .style('opacity', '0.3');
}

let changeOpacity = function (color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity+')');
}

let drawRegion = function (regionId, sparkle = false) {
  return new Promise( function (resolve, reject) {
    let canvas = propGraphParams['canvases'][regionId],
        region = propGraphParams['regions'][regionId],
        squareOuterLength = propGraphParams['squareOuterLength'],
        squares = region['squares'],
        numSquares = region['numSquares'],
        ctx = canvas.getContext('2d'),
        squareSpacing = Math.floor(squareOuterLength / 9),
        squareInnerLength = squareOuterLength - squareSpacing,
        sparkleTime;

    if (sparkle) {
      squares = shuffleArray(squares);
      sparkleTime = 800 / squares.length;
    }

    ctx.fillStyle = region['color'];
    for (let i = 0; i < numSquares; ++i) {
      const point = squares[i];

      if (sparkle) {
        setTimeout(function() {
          ctx.fillRect(point.x,
                       point.y,
                       squareInnerLength,
                       squareInnerLength);
        }, sparkleTime * i);
      }
      else {
        ctx.fillRect(point.x,
                     point.y,
                     squareInnerLength,
                     squareInnerLength);
      }
    }

    if (sparkle) {
      setTimeout(function() {
        resolve();
      }, sparkleTime * (numSquares - 1));
    }
    else
      resolve();

  });
}

let drawRegionByColumn = function (regionId) {
  let canvas = propGraphParams['canvases'][regionId],
      region = propGraphParams['regions'][regionId],
      squareOuterLength = propGraphParams['squareOuterLength'],
      squares = region['squares'],
      numSquares = region['numSquares'],
      ctx = canvas.getContext('2d'),
      squareSpacing = Math.floor(squareOuterLength / 3),
      squareInnerLength = squareOuterLength - squareSpacing,
      columnLength = propGraphParams['columnLength'];

  ctx.fillStyle = region['color'];

  let squaresRemaining = numSquares;
  for (let i = 0; i < numSquares; i += columnLength) {

    let squaresInColumn = squaresRemaining - columnLength > 0 ? columnLength : squaresRemaining;

    setTimeout(function() {
      for (let j = 0; j < squaresInColumn; ++j) {
        const point = squares[i + j];

        ctx.fillRect(point.x,
                     point.y,
                     squareInnerLength,
                     squareInnerLength);
      }
    }, 10 * i);

    squaresRemaining -= columnLength;
  }

}

let setAllRegionSquares = function () {

  let direction = 1,
      regions = propGraphParams['regions'],
      squareOuterLength = propGraphParams['squareOuterLength'],
      columnLength = propGraphParams['columnLength'],
      startSquareId = regions[1]['numSquares'];

  for (let ii = 0; ii < regions.length; ii++) {
    let region = regions[ii],
        numSquares = region['numSquares'];

    if (ii < 2) {
      region['squares'] = d3.range(0, numSquares).map( function(index) {
                            return {
                              id: index,
                              x: squareOuterLength * Math.floor(index / columnLength),
                              y: squareOuterLength * (index % columnLength)
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
      columnLength = propGraphParams['columnLength'],
      regionSquares = region['squares'];

  for (let ii = 0; ii < numSquares; ii++) {
    let squareId = startSquareId + ii;

    if (direction == 1) {
      
      let square = getSquareObject(squareId);
      regionSquares.push(square);

      if ((squareId + 1) % columnLength == 0)
        direction = 2;
    }
    else {
      
      let newSquareId = (Math.floor(squareId / columnLength) + 1)  * columnLength - (squareId % columnLength) - 1,
          square = getSquareObject(newSquareId);

      regionSquares.push(square);
      
      if ((squareId + 1) % columnLength == 0)
        direction = 1;
    } 
  }
  return direction;
}

let getSquareObject = function (index) {
  let squareOuterLength = propGraphParams['squareOuterLength'],
      columnLength = propGraphParams['columnLength'];

  return {
    id: index,
    x: squareOuterLength * Math.floor(index / columnLength),
    y: squareOuterLength * (index % columnLength)
  }
}