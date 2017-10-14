
let slide1 = function (data) {
  slideInProgress = true;
  closeMapView();
  let mapModeHeight = $('.graph-viewers').height();
  updateBarGraphParam('marginBottom', 100);
  updateBarGraphDims(mapModeHeight);
  showOpeningScreen();
}

let slide2 = function (data) {
  // let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  Promise.resolve()
      .then( function () {
        return Promise.all([
          updateStoryText(0, ''),
          fadeAll(1000)
        ]);
      })
      .then( function () {
        let isOpeningScreen = d3.select('.bar-graph').attr('viewBox') != null;
        if (isOpeningScreen)
          return fadeOpeningScreen(1000);
      })
      .then( function () {
        return Promise.all([
          updateBarGraphParam('data', []),
          updateBars(0, 0, 0),
          updateXAxis(0, true),
          updateBarGraphParam('tickValues', [35]),
          updateYAxis(0, true)
        ]);
      })
      .then( function () {
        return Promise.all([
          showAll(2000),
          updateStoryText(2000, 'The federal corporate income tax rate is 35 percent...'),
          updateYAxis(2000),
          updatePercentLine(2000)
        ]);
      })
      .then( function () {
        return appendStoryText(2000, 'but large corporations rarely pay that amount', 0);
      })
      .then( function () {
        return updateStoryText(0, '');
      })
      .then( function () {
        return Promise.all([
          updateStoryText(2000, '258 Fortune 500 companies reported consistent profits from 2008 to 2015.'),
          updateBarGraphParam('data', data),
          updateBarGraphParam('yParam', 'rate'),
          updateBarGraphParam('tickValues', [0,35]),
          
          updateXAxis(2000),
          updateYAxis(2000),

          updateBars(0, 2000, 2000)
        ]);
      })
      .then( function () {
        return updateStoryText(0, '', 1000);
      })
      .then( function () {
        return Promise.all([
          updateStoryText(2000, '241 of those companies paid less than 35% effective tax rate over the 8 years'),
          highlightBarsSplit('rate', 35, 'red', 'green', 2000)
        ])
      })

      // .then( function () {
      //   let mapModeHeight = $('.graph-viewers').height();

      //   return Promise.all([
      //     updateStoryText(1000, 'dynamicText'),
      //     closeMapView(),
      //     updateBarGraphParam('marginBottom', 200),
      //     updateBarGraphDims(mapModeHeight),

      //     updateXScale(),
      //     updateYScale(-15, 50),
      //     updateBarGraphSVG(2000),

      //     updateBarGraphText(null, 2000),
      //     updateCompanyLabel(2000),

      //     updateBarGraphParam('data', data),
      //     updateBarGraphParam('yParam', 'rate'),

      //     updateBarGraphParam('tickValues', [0,35]),
      //     updateYAxis(2000),
      //     updateXAxis(2000),
      //     updatePercentLine(2000),
      //     updateBars(0, 2000, 2000)
      //   ]);
      // })
      // .then( function () {
      //   if (shouldFade) {
      //     shouldFade = false;
      //     return showAll(2000);
      //   }
      // })
  // .then( function () {
  //   return updateStoryText(1000, 'but large corporations rarely pay that amount');
  // })
  // .then( function () {
  //   return updateStoryText(1000, '258 Fortune 500 companies reported consistent profits from 2008 to 2015.', true);
  // })
  // .then( function () {
  //   d3.select('.percent-line')
  //     .moveToFront();
  //   return highlightBarsSplit('rate', 35, 'red', 'green', 1000);
  // })
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

      let barGraphText;
      if (ii > 1)
        barGraphText = 'At least ' + ii + ' years of no federal tax';
      else
        barGraphText = 'At least ' + ii + ' year of no federal tax';

      chain = chain.then(function () {
                return Promise.all([
                  updateBarGraphText(barGraphText, 1500),
                  highlightSomeBars(companiesYearsNoTax[ii], 'red', 500)
                ]);
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
                console.log(companiesRebates[rebate]);
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
      fadeOutPercentLine(1000),
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
                console.log(companiesTop3EmpChanges);
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
    console.log(companiesLostEmployees);
    return highlightSomeBars([companiesLostEmployees[1]], 'red', 1000);
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
      fadeOutPercentLine(1000),
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
