
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
          appendStoryText(0, '', 1000),
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
          appendStoryText(2000, 'The federal corporate income tax rate is 35 percent...'),
          updateYAxis(2000),
          updatePercentLine(2000)
        ]);
      })
      .then( function () {
        return appendStoryText(2000, 'but large corporations rarely pay that amount');
      })
      .then( function () {
        return appendStoryText(0, '', 1000);
      })
      .then( function () {
        return Promise.all([
          appendStoryText(1000, '258 Fortune 500 companies reported consistent profits from 2008 to 2015.'),
          updateBarGraphParam('data', data),
          updateBarGraphParam('yParam', 'rate'),
          updateBarGraphParam('tickValues', [0,35]),
          
          updateXAxis(2000),
          updateYAxis(2000),

          updateBars(0, 2000, 2000)
        ]);
      })
      .then( function () {
        return appendStoryText(0, '', 1000);
      })
      .then( function () {
        d3.select('.percent-line')
          .moveToFront();

        return Promise.all([
          appendStoryText(2000, '241 of those companies paid less than 35% effective tax rate over the 8 years'),
          highlightBarsSplit('rate', 35, 'red', 'black', 2000)
        ])
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

    let numCompanies = 0;

    let chain = Promise.resolve();
    for (let ii = Object.keys(companiesYearsNoTax).length; ii > 0; ii--) {

      numCompanies += companiesYearsNoTax[ii].length;

      let barGraphText;
      if (ii > 1)
        barGraphText = numCompanies + ' companies went at least ' + ii + ' years without paying federal tax';
      else
        barGraphText = numCompanies + ' companies went at least ' + ii + ' year without paying federal tax';

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

  fadeStart(1000, data)
  .then( function () {
    return Promise.all([
      updateYScale(-2500, 40000),
      updateXAxis(1000),
      updateBarGraphParam('tickValues', [-2500, 0, 20000, 40000]),
      updateYAxis(1000, false, ending = ''),
      fadeOutPercentLine(1000),
      updateBarGraphParam('yParam', 'tax_break'),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
    ])
  })
  .then( function () {
    return Promise.all([
      appendStoryText(2000, 'Just 25 companies claimed $286 billion in tax breaks (more than half of total) over the eight years between 2008 and 2015', 0),
      highlightSomeBars(companiesTop25, 'red', 1000)
    ])
  })
  .then( function () {
    return Promise.all([
      updateXAxis(1000),
      updateBars(0, 1000, 1000)
    ])
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide5 = function (data, companiesRebates) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  let companiesRebatesText = {
    'deferredTaxes': '<b>deferred taxes',
    'accDepreciation': '<b>accelerated depreciation',
    'dpad': 'the <b>Domestic Production Activities Deduction',
    'researchExperiment': 'the <b>Research and Experimentation Tax Credit',
    'stockOptions': '<b>executive stock options'
  };

  fadeStart(1000, data)
  .then( function () {
    let chain = highlightAllBars('#000', 1000),
        rebates = Object.keys(companiesRebates),
        lastRebate = rebates[rebates.length - 1],
        numCompanies = 0,
        barGraphText;

    for (let rebate in companiesRebates) {
      chain = chain.then( function () {
                numCompanies += companiesRebates[rebate].length;
                barGraphText = numCompanies + ' companies used ' + companiesRebatesText[rebate] + '</b> to lower their taxes.';

                return Promise.all([
                  appendStoryText(2000, barGraphText, 1),
                  highlightSomeBars(companiesRebates[rebate], 'red', 1000)
                ]);
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
