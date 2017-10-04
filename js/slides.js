
let slide1 = function (data) {
  slideInProgress = true;
  closeMapView();
  let mapModeHeight = $('.graph-viewers').height();
  updateBarGraphParam('marginBottom', 100);
  updateBarGraphDims(mapModeHeight);
  updateBarGraphSVG(1000);
  showOpeningScreen();
}

let slide2 = function (data) {
  // let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  slidePercentLine('35', 1000)
  .then( function () {
    return fadeStart(1000, data);
  })
  .then( function () {
    return highlightBarsSplit('rate', 35, 'red', 'green', 1000);
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide3 = function (data, companiesYearsNoTax) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(100, data)
  .then(function () {
    let chain = Promise.resolve();
    for (let ii = Object.keys(companiesYearsNoTax).length; ii > 0; ii--) {
      chain = chain.then(function () {
                return highlightSomeBars(companiesYearsNoTax[ii], 'red', 1000);
              });
    }
    return chain;
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide4 = function (data, companiesTop25) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(100, data)
  .then( function () {
    return highlightSomeBars(companiesTop25, 'red', 1000);
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide5 = function (data, companiesRebates) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(500, data)
  .then( function () {
    let chain = Promise.resolve();
    let rebates = Object.keys(companiesRebates);
    let lastRebate = rebates[rebates.length - 1];

    for (let rebate in companiesRebates) {
      chain = chain.then( function () {
                return highlightSomeBars(companiesRebates[rebate], 'red', 1000);
              })

      if (rebate != lastRebate) {
        chain = chain.then( function () {
                  return highlightAllBars('#000', 1000);
                });
      }
    }
    return chain;
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide6 = function (data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees) {

  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'];

  fadeStart(500, data)
  .then( function () {
    return Promise.all([
      fadeOutPercentLine('35', 1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateBarGraphParam('data', companiesIPS),
      updateXAxis(1000),
      updateBarGraphParam('tickValues', [0,20,35]),
      updateYAxis(1000),
      updateBars(1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-15, 20),
      updateBarGraphParam('tickValues', [-15, 0, 20, 35]),
      updateYAxis(1000),
      updateXAxis(1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-15, 20),
      updateBarGraphParam('tickValues', [-15, 0, 20, 35]),
      updateYAxis(1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-70, 2000),
      updateBarGraphParam('tickValues', [-70, 0, 500, 1000, 1500, 2000]),
      updateYAxis(1000),
      updateXAxis(1000),
      updateBarGraphParam('yParam', 'adjusted_emp_change'),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    let chain = Promise.resolve();
    for (let rank in companiesTop3EmpChanges) {
      chain = chain.then( function () {
                return highlightSomeBars(companiesTop3EmpChanges[rank], 'red', 1000);
              })
              .then( function () {
                return highlightAllBars('#000', 1000);
              });
    }
    return chain;
  })
  .then( function () {
    return highlightSomeBars(companiesLostEmployees, 'red', 1000);
  })
  .then( function () {
    return Promise.all([
      updateBarGraphParam('data', companiesLostEmployees),
      updateYScale(-70, 0),
      updateXAxis(1000),
      updateBarGraphParam('tickValues', [-70, 0]),
      updateYAxis(1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return highlightAllBars('#000', 1000);
  })
  .then( function () {
    slideInProgress = false;
    shouldFade = true;
  });
}

let slide7 = function (data) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(500, data)
  .then( function () {
    slideInProgress = false;
  });
}

let slide8 = function (data, companiesForeignDiff) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(500, data)
  .then( function () {
    return Promise.all([
      fadeOutPercentLine('35', 1000),
      highlightSomeBars(companiesForeignDiff, 'red', 1000),
      updateBarGraphParam('data', companiesForeignDiff),
      updateBarGraphParam('yParam', 'us_foreign_diff'),
      updateBars(1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-40, 40),
      updateXAxis(1000),
      updateBarGraphParam('tickValues', [-40, 0, 40]),
      updateYAxis(1000),
      updateBars(0, 1000, 1000)
    ])
  })
  .then( function () {
    return highlightBarsSplit('us_foreign_diff', 0, 'red', 'green', 1000);
  })
  .then( function () {
    slideInProgress = false;
    shouldFade = true;
  });
}

let slide9 = function (data, companiesCompetitors) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(500, data)
  .then( function () {
    let chain = Promise.resolve();
    for (let pair in companiesCompetitors) {
      chain = chain.then( function () {
                return highlightSomeBars(companiesCompetitors[pair], 'red', 1000);
              })
              .then( function () {
                return highlightAllBars('#000', 1000);
              });
    }
    return chain;
  })
  .then( function () {
    slideInProgress = false;
  });
}
