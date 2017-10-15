
let slide1 = function (data) {
  slideInProgress = true;
  closeMapView();
  let mapModeHeight = $('.graph-viewers').height();
  updateBarGraphParam('marginBottom', 100);
  updateBarGraphDims(mapModeHeight);
  showOpeningScreen();
}

let slide2 = function (data) {
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
          appendStoryText(1000,
                          'A study by the Institute on Taxation and Economic Policy found that 258 Fortune 500 companies reported consistent profits from 2008 to 2015.',
                          false,
                          null,
                          true),
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
    return appendStoryText(2000, 'These companies generated so many excess tax breaks that they sometimes reported negative taxes...', 0, null, true);
  })
  .then(function () {
    return appendStoryText(2000, 'this means that they made more after taxes than before taxes in those years.', false, null, true);
  })
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
        barGraphText;

    for (let rebate in companiesRebates) {
      chain = chain.then( function () {
                let numCompanies = companiesRebates[rebate].length;
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

let slide6 = function (data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees, companiesCompUp) {

  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'];

  fadeStart(1000, data)
  .then( function () {
    return Promise.all([
      appendStoryText(1000, '"I am going to cut business taxes massively. They\'re going to start hiring people." - Trump', false, 'public/img/donald-trump.png'),
      fadeOutPercentLine(2000),
      updateBars(0, 2000, 2000)
    ]);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1000, 'Another study found that 92 of these 258 companies had effective tax rates below 20% for 8 years', 1),
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
    return highlightAllBars('#000', 2000);
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
      appendStoryText(1000, 'A few companies did show significant growth over these 8 years...', 1),
      updateYScale(-70, 2000),
      updateBarGraphParam('tickValues', [-70, 0, 500, 1000, 1500, 2000]),
      updateYAxis(1000),
      updateXAxis(1000),
      updateBarGraphParam('yParam', 'adjusted_emp_change'),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    let chain = Promise.resolve(),
        barGraphWidth = barGraphParams['barGraphWidth'],
        x = barGraphWidth * 0.7;
    for (let rank in companiesTop3EmpChanges) {
      let companyData = companiesTop3EmpChanges[rank],
          companyName = companyData[0]['company_name'],
          companyNameSlug = slugify(companyName);

      chain = chain.then( function () {
                return Promise.all([
                  highlightSomeBars(companiesTop3EmpChanges[rank], 'red', 1000),
                  updateCompanyLabel(1000, companyName)
                ]);
              })
              .then( function () {
                return Promise.all([
                  highlightAllBars('#000', 1000)
                ]);
              });
    }
    return chain;
  })
  .then( function () {
    return Promise.all([
      highlightSomeBars(companiesLostEmployees, 'red', 1000),
      appendStoryText(1000, 'But the majority of these companies laid off employees while maintaining profits and a low tax rate', 1),
      updateCompanyLabel(1000, '')
    ]);
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
    return Promise.all([
      appendStoryText(3000, 'The CEOs of 33 of these companies raised their salaries while still cutting jobs.', 1),
      highlightSomeBars(companiesCompUp, 'red', 3000)
    ]);
  })
  .then( function () {
    return highlightAllBars('#000', 1000);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1000, 'This is AT&T.', 1),
      highlightSomeBars([companiesLostEmployees[1]], 'red', 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1500, 'AT&T\'s workforce was reduced by <b>79450 employees</b> from 2008 to 2016', 1000),
      highlightSomeBars([companiesLostEmployees[1]], 'red', 1000)
    ]);
  })
  .then( function () {
    return appendStoryText(3000, '...more than any other company in this study.');
  })
  .then ( function () {
    return appendStoryText(1500, 
                    '"Lower taxes drives more investment, drives more hiring, drives greater wages" - Randall L. Stephenson, CEO of AT&T',
                    1000,
                    'public/img/randall-stephenson.png');
  })
  .then( function () {
    return appendStoryText(1500, 'The CEO enjoyed a <b>$9 million raise</b> in this same time period.', 1000);
  })
  .then( function () {
    slideInProgress = false;
    shouldFade = true;
  });
}
let slide7 = function (data, companiesForeignDiff) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(1000, data)
  .then( function () {
    return Promise.all([
      appendStoryText(3000,
                      '"America is one of the highest-taxed nations in the world. Reducing taxes will cause new companies and new jobs to come roaring back into our country." - Donald Trump',
                      false,
                      'public/img/donald-trump.png', true),
    ]);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1500, 'Of the 258 companies that showed consistent profits over 8 years...', 1000),
      fadeOutPercentLine(2000),
      updateBars(0, 2000, 2000)
    ]);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1500, '107 had significant foreign profits (more than 10% of all profits)'),
      highlightSomeBars(companiesForeignDiff, 'red', 1000),
    ]);
  })
  .then( function () {
    return Promise.all([
      appendStoryText(1500, '', 1),
      updateBarGraphParam('data', companiesForeignDiff),
      updateBarGraphParam('yParam', 'us_foreign_diff'),
      updateBars(1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
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
      return Promise.all([
        appendStoryText(1500,
                        '64 of these companies paid higher foreign tax rates on their foreign profits than they paid in U.S. taxes on their U.S. profits.',
                        1,
                        null,
                        true),
        highlightBarsSplit('us_foreign_diff', 0, 'red', 'green', 1000)
      ]);
  })
  .then( function () {
    return appendStoryText(1500,
                        'These higher foreign tax rates do not seem to hinder companies from doing business abroad. This is just more evidence that corporate income tax levels are usually not a significant determinant of what companies do.',
                        1,
                        null,
                        true);
  })
  .then( function () {
    slideInProgress = false;
    shouldFade = true;
  });
}

let slide8 = function (data, companiesCompetitors) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(500, data)
  .then( function () {
    return appendStoryText(1500, 'Who loses out?');
  })
  .then( function () {
    let chain = appendStoryText(1500, 'Competing companies often have drastically different tax rates.', 1000),
        counter = -1;
    for (let pair in companiesCompetitors) {
      let competitorPair = companiesCompetitors[pair],
          competitorHigh = competitorPair[0],
          competitorLow = competitorPair[1];

      chain = chain.then( function () {
                return Promise.all([
                  appendStoryText(1000, competitorHigh['company_name'] + ' ' + competitorHigh['rate'] + '%...', 500),
                  highlightSomeBars([competitorHigh], 'red', 1000)
                ]);
              })
              .then( function () {
                return Promise.all([
                  appendStoryText(1000, competitorLow['company_name'] + ' ' + competitorLow['rate'] + '%'),
                  highlightSomeBars([competitorLow], 'red', 1000)
                ]);
              })
              .then( function () {
                counter++;
                if (counter < Object.keys(companiesCompetitors).length - 1)
                  return highlightAllBars('#000', 1000);
              });
    }
    return chain;
  })
  .then( function () {
    slideInProgress = false;
  });
}

let slide9 = function (data) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  fadeStart(1000, data)
  .then( function () {
    return highlightBarsSplit('rate', 35, 'red', 'black', 2000);
  })
  .then( function () {
    return appendStoryText(1500, 'Who else loses out?', 1000);
  })
  .then( function () {
    return appendStoryText(1500, ' The American people.');
  })
  .then( function () {
    return appendStoryText(4000,
      'There is plenty of blame to share for today\'s sad situation. These corporate loopholes and tax breaks are generally legal, and stem from laws passed over the years by Congress and signed by various presidents.',
      1000,
      null,
      true);
  })
  .then( function () {
    return appendStoryText(4000,
      'But that does not mean that low-tax corporations bear no responsibility. The tax laws were not enacted in a vacuum; they were adopted in response to relentless corporate lobbying, threats and campaign support.',
      1000,
      null,
      true);
  })
  .then( function () {
    return appendStoryText(4000,
      'These 241 companies saved a total of almost $527 billion over the last eight years.',
      1000,
      null,
      true);
  })
  .then( function () {
    slideInProgress = false;
    $('.slide-explore').trigger( "click" );
  })
}