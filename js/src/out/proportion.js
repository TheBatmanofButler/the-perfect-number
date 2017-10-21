var propGraphParams = {
  regions: [],
  propWidth: null,
  propHeight: null,
  squareOuterLength: null,
  columnLength: null,
  squares: [],
  canvases: []
};
var getSquareOuterLengthHelper = function(p1, p2, numSquares) {
  var pxy = Math.ceil(Math.sqrt(numSquares * p2 / p1));
  if (Math.floor(pxy * p1 / p2) * pxy < numSquares)
    return p1 / Math.ceil(pxy * p1 / p2);
  else
    return p2 / pxy;
};
var getSquareOuterLength = function(width, height, numSquares) {
  var sx = getSquareOuterLengthHelper(height, width, numSquares),
      sy = getSquareOuterLengthHelper(width, height, numSquares);
  return Math.floor(Math.max(sx, sy));
};
var initPropGraph = function(companyName) {
  allRegionsDrawn = false;
  propGraphParams['regions'] = comparisonData[companyName];
};
var updatePropGraphParams = function() {
  var propWidth = $('.proportion-graph-wrapper').width(),
      propHeight = $('.proportion-graph-wrapper').height(),
      numSquares = propGraphParams['regions'][0]['numSquares'];
  squareOuterLength = getSquareOuterLength(propWidth, propHeight, numSquares), columnLength = Math.floor(propHeight / squareOuterLength), squares = getGridSquares(numSquares, squareOuterLength, columnLength);
  propGraphParams['propWidth'] = propWidth;
  propGraphParams['propHeight'] = propHeight;
  propGraphParams['numSquares'] = numSquares;
  propGraphParams['squareOuterLength'] = squareOuterLength;
  propGraphParams['columnLength'] = columnLength;
  propGraphParams['squares'] = squares;
};
var getGridSquares = function(numSquares, squareOuterLength, columnLength) {
  return d3.range(0, numSquares).map(function(index) {
    return {
      id: index,
      x: squareOuterLength * Math.floor(index / columnLength),
      y: squareOuterLength * (index % columnLength)
    };
  });
};
var updatePropGraph = function() {
  var firstDraw = arguments[0] !== (void 0) ? arguments[0] : true;
  if (propGraphParams['regions'].length == 0)
    return;
  updatePropGraphParams();
  return Promise.all([setAllRegionSquares(), getHoverMap(), createCanvases()]).then(function() {
    return drawAllCanvases(firstDraw);
  });
};
var drawAllCanvases = function(firstDraw) {
  var regions = propGraphParams['regions'];
  var chain = Promise.resolve();
  var $__4 = function(regionId) {
    addCanvas(regionId);
    if (firstDraw) {
      if (regionId == 0) {
        chain = chain.then(function() {
          return Promise.all([showCanvas(regionId, 1000), drawRegion(regionId), showHoverText(regionId, 2000)]);
        });
      } else {
        chain = chain.then(function() {
          return Promise.all([showCanvas(regionId, 1000)]);
        }).then(function() {
          return Promise.all([showHoverText(regionId, 2000), drawRegion(regionId, firstDraw)]);
        });
      }
    } else {
      showCanvas(regionId, 0);
      drawRegion(regionId);
    }
  };
  for (var regionId in regions) {
    $__4(regionId);
  }
  chain = chain.then(function() {
    var unit = propGraphParams['regions'][0]['unit'];
    return updateStoryText(2000, 'Each square is the equivalent of <b>$' + unit + '</b>');
  }).then(function() {
    allRegionsDrawn = true;
  });
  return chain;
};
var shuffleArray = function(a) {
  var $__1,
      $__2,
      $__3;
  for (var i = a.length; i; i--) {
    var j = Math.floor(Math.random() * i);
    ($__1 = [a[j], a[i - 1]], a[i - 1] = ($__2 = $__1[Symbol.iterator](), ($__3 = $__2.next()).done ? void 0 : $__3.value), a[j] = ($__3 = $__2.next()).done ? void 0 : $__3.value, $__1);
  }
  return a;
};
var createCanvases = function() {
  return new Promise(function(resolve, reject) {
    var regions = propGraphParams['regions'],
        propWidth = propGraphParams['propWidth'],
        propHeight = propGraphParams['propHeight'],
        canvases = propGraphParams['canvases'] = [],
        unit = propGraphParams['regions'][0]['unit'];
    updateStoryText(2000, 'Each square is the equivalent of <b>$' + unit + '</b>');
    var canvasObj;
    var $__5 = function(ii) {
      var canvas = document.createElement('canvas');
      canvases.push(canvas);
      canvasObj = d3.select(canvas).attr('class', function(d) {
        if (ii == 1)
          return 'animated';
        else
          return 'non-animated';
      }).attr('width', propWidth).attr('height', propHeight);
    };
    for (var ii in regions) {
      $__5(ii);
    }
    canvasObj.call(addMouseEvent);
    d3.selectAll('canvas').transition().duration(500).style('opacity', 0).remove().end(resolve);
  });
};
var addMouseEvent = function(canvasObj) {
  var hoverMap = propGraphParams['hoverMap'],
      regions = propGraphParams['regions'],
      numSquares = propGraphParams['numSquares'];
  canvasObj.on('mousemove', function() {
    if (allRegionsDrawn) {
      var mouseX = d3.event.offsetX,
          mouseY = d3.event.offsetY,
          column = Math.floor(mouseX / squareOuterLength),
          row = Math.floor(mouseY / squareOuterLength),
          squareId = column * columnLength + row;
      if (squareId in propGraphParams['hoverMap'])
        showProperRegion(squareId);
      else {
        showAllRegions();
      }
    }
  }).on('mouseout', function() {
    if (allRegionsDrawn)
      showAllRegions();
  });
};
var getHoverMap = function() {
  var hoverMap = propGraphParams['hoverMap'] = {},
      regions = propGraphParams['regions'];
  for (var ii = regions.length - 1; ii > -1; ii--) {
    var region = regions[ii],
        regionSquares = region['squares'];
    for (var jj in regionSquares) {
      var square = regionSquares[jj],
          squareId = square['id'];
      if (!hoverMap.hasOwnProperty(squareId))
        hoverMap[squareId] = ii;
    }
  }
};
var showHoverText = function(regionId, duration) {
  var region = propGraphParams['regions'][regionId];
  var text = region['text'] + ' <b>$' + region['money'] + '</b>';
  if ($('.dynamic-text').html() != text)
    return updateStoryText(duration, text);
  else
    return Promise.resolve();
};
var showProperRegion = function(squareId) {
  var hoverMap = propGraphParams['hoverMap'],
      regionId = hoverMap[squareId];
  showHoverText(regionId, 2000);
  if (regionId == 0)
    showOuterMainRegion();
  else if (regionId == 1)
    showInnerMainRegion();
  else
    showComparisonRegion(regionId);
};
var showAllRegions = function() {
  var canvases = propGraphParams['canvases'],
      unit = propGraphParams['regions'][0]['unit'];
  updateStoryText(2000, 'Each square is the equivalent of <b>$' + unit + '</b>');
  for (var ii = 0; ii < canvases.length; ii++)
    showCanvas(ii);
};
var showOuterMainRegion = function() {
  var canvases = propGraphParams['canvases'];
  showCanvas(0);
  for (var ii = 1; ii < canvases.length; ii++) {
    hideCanvas(ii);
  }
};
var showInnerMainRegion = function() {
  var canvases = propGraphParams['canvases'];
  showCanvas(1);
  makeCanvasOpaque(0, 0.3);
  for (var ii = 2; ii < canvases.length; ii++) {
    hideCanvas(ii);
  }
};
var showComparisonRegion = function(canvasId) {
  var canvases = propGraphParams['canvases'];
  for (var ii = 0; ii < canvases.length; ii++) {
    if (ii == canvasId)
      showCanvas(ii);
    else
      makeCanvasOpaque(ii);
  }
};
var addCanvas = function(canvasId) {
  var canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];
  d3.select(canvas).style('opacity', '0');
  $('.proportion-graph-wrapper').append(canvas);
};
var showCanvas = function(canvasId) {
  var duration = arguments[1] !== (void 0) ? arguments[1] : 100;
  return new Promise(function(resolve, reject) {
    var canvases = propGraphParams['canvases'],
        canvas = canvases[canvasId];
    d3.select(canvas).transition().duration(duration).style('opacity', '1').end(resolve);
  });
};
var hideCanvas = function(canvasId) {
  var canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];
  d3.select(canvas).transition().duration(100).style('opacity', '0');
};
var makeCanvasOpaque = function(canvasId) {
  var canvases = propGraphParams['canvases'],
      canvas = canvases[canvasId];
  d3.select(canvas).transition().duration(100).style('opacity', '0.3');
};
var changeOpacity = function(color, opacity) {
  return color.replace(/[\d\.]+\)$/g, opacity + ')');
};
var drawRegion = function(regionId) {
  var firstDraw = arguments[1] !== (void 0) ? arguments[1] : false;
  return new Promise(function(resolve, reject) {
    var canvas = propGraphParams['canvases'][regionId],
        region = propGraphParams['regions'][regionId],
        squareOuterLength = propGraphParams['squareOuterLength'],
        squares = region['squares'],
        numSquares = region['numSquares'],
        ctx = canvas.getContext('2d'),
        squareSpacing,
        squareInnerLength,
        sparkleTime;
    squareSpacing = Math.floor(squareOuterLength / 9);
    if (squareSpacing == 0)
      squareSpacing = 0.5;
    squareInnerLength = squareOuterLength - squareSpacing;
    if (firstDraw) {
      squares = shuffleArray(squares);
      sparkleTime = 800 / squares.length;
    }
    ctx.fillStyle = region['color'];
    var $__6 = function(i) {
      var point = squares[i];
      if (firstDraw) {
        setTimeout(function() {
          ctx.fillRect(point.x, point.y, squareInnerLength, squareInnerLength);
        }, sparkleTime * i);
      } else {
        ctx.fillRect(point.x, point.y, squareInnerLength, squareInnerLength);
      }
    };
    for (var i = 0; i < numSquares; ++i) {
      $__6(i);
    }
    if (firstDraw) {
      setTimeout(function() {
        resolve();
      }, sparkleTime * (numSquares - 1));
    } else
      resolve();
  });
};
var drawRegionByColumn = function(regionId) {
  var canvas = propGraphParams['canvases'][regionId],
      region = propGraphParams['regions'][regionId],
      squareOuterLength = propGraphParams['squareOuterLength'],
      squares = region['squares'],
      numSquares = region['numSquares'],
      ctx = canvas.getContext('2d'),
      squareSpacing,
      squareInnerLength,
      columnLength = propGraphParams['columnLength'];
  squareSpacing = Math.floor(squareOuterLength / 9);
  if (squareSpacing == 0)
    squareSpacing = 0.5;
  squareInnerLength = squareOuterLength - squareSpacing;
  ctx.fillStyle = region['color'];
  var squaresRemaining = numSquares;
  var $__7 = function(i) {
    var squaresInColumn = squaresRemaining - columnLength > 0 ? columnLength : squaresRemaining;
    setTimeout(function() {
      for (var j = 0; j < squaresInColumn; ++j) {
        var point = squares[i + j];
        ctx.fillRect(point.x, point.y, squareInnerLength, squareInnerLength);
      }
    }, 10 * i);
    squaresRemaining -= columnLength;
  };
  for (var i = 0; i < numSquares; i += columnLength) {
    $__7(i);
  }
};
var setAllRegionSquares = function() {
  var direction = 1,
      regions = propGraphParams['regions'],
      squareOuterLength = propGraphParams['squareOuterLength'],
      columnLength = propGraphParams['columnLength'],
      startSquareId = regions[1]['numSquares'];
  if (regions[0]['text'] == 'Tax breaks totaled ')
    startSquareId = 0;
  for (var ii = 0; ii < regions.length; ii++) {
    var region = regions[ii],
        numSquares = region['numSquares'];
    if (ii < 2) {
      direction = setSubregionSquares(region, numSquares, 0, 1);
    } else {
      if (regions[0]['text'] == 'Tax breaks totaled ' && ii == 2)
        direction = 1;
      direction = setSubregionSquares(region, numSquares, startSquareId, direction);
    }
    if (ii > 1)
      startSquareId += numSquares;
  }
};
var setSubregionSquares = function(region, numSquares, startSquareId, direction) {
  region['squares'] = [];
  var squares = propGraphParams['squares'],
      columnLength = propGraphParams['columnLength'],
      regionSquares = region['squares'];
  for (var ii = 0; ii < numSquares; ii++) {
    var squareId = startSquareId + ii;
    if (direction == 1) {
      var square = getSquareObject(squareId);
      regionSquares.push(square);
      if ((squareId + 1) % columnLength == 0)
        direction = 2;
    } else {
      var newSquareId = (Math.floor(squareId / columnLength) + 1) * columnLength - (squareId % columnLength) - 1,
          square$__8 = getSquareObject(newSquareId);
      regionSquares.push(square$__8);
      if ((squareId + 1) % columnLength == 0)
        direction = 1;
    }
  }
  return direction;
};
var getSquareObject = function(index) {
  var squareOuterLength = propGraphParams['squareOuterLength'],
      columnLength = propGraphParams['columnLength'];
  return {
    id: index,
    x: squareOuterLength * Math.floor(index / columnLength),
    y: squareOuterLength * (index % columnLength)
  };
};
