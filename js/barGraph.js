let margin = {
  top: 50,
  right: 80,
  bottom: 100,
  left: 80
};

let barGraphParams = {
  barGraphWidth: null,
  barGraphHeight: null,
  x: null,
  y: null,
  yParam: null,
  data: null
}

let slideInProgress = false;

let createSlides = function (data,
                             companiesYearsNoTax,
                             companiesTop25,
                             companiesRebates,
                             companiesIPS,
                             companiesTop3EmpChanges,
                             companiesLostEmployees,
                             companiesForeignDiff,
                             companiesCompetitors) {

  barGraphParams['data'] = data;

  let barGraphWidth = $('.bar-graph-viewer').width() - margin.left - margin.right,
      barGraphHeight = $('.bar-graph-viewer').height() - margin.top - margin.bottom;

  barGraphParams['barGraphWidth'] = barGraphWidth;
  barGraphParams['barGraphHeight'] = barGraphHeight;

  initBarGraph();

  $('#slide1').click( function (e) {
    if (slideInProgress) return;
    slide1(barGraphWidth, barGraphHeight);
    currentSlide = 1;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide1 div:first').addClass('active-slide-no-square');
  });

  $('#slide2').click( function (e) {
    if (slideInProgress) return;
    slide2(data);
    currentSlide = 2;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide2 div:first').addClass('active-slide-no-square');
  });

  $('#slide3').click( function (e) {
    if (slideInProgress) return;

    $('.proportion-graph').animate({'opacity': '0'}, 500, function () {
      $('.proportion-graph-viewer').animate({'height': '0'}, 1000, function () {
        $('.proportion-graph-viewer').hide( function () {

            // updateXScale(barGraphWidth);
            // updateYScale(-15, 50);
            mapModeHeight = $('.graph-viewers').height();
            // resizeBarGraph();
          });
        });
    });

    slide3(data, companiesYearsNoTax);
    currentSlide = 3;

    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide3 div:first').addClass('active-slide-no-square');
  });

  $('#slide4').click( function (e) {
    if (slideInProgress) return;
    slide4(data, companiesTop25);
    currentSlide = 4;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide4 div:first').addClass('active-slide-no-square');
  });

  $('#slide5').click( function (e) {
    if (slideInProgress) return;
    slide5(data, companiesRebates);
    currentSlide = 5;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide5 div:first').addClass('active-slide-no-square');
  });

  $('#slide6').click( function (e) {
    if (slideInProgress) return;
    slide6(data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees);
    currentSlide = 6;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide6 div:first').addClass('active-slide-no-square');
  });

  $('#slide7').click( function (e) {
    if (slideInProgress) return;
    slide7(data);
    currentSlide = 7;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide7 div:first').addClass('active-slide-no-square');
  });

  $('#slide8').click( function (e) {
    if (slideInProgress) return;
    slide8(data, companiesForeignDiff);
    currentSlide = 8;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide8 div:first').addClass('active-slide-no-square');
  });

  $('#slide9').click( function (e) {
    if (slideInProgress) return;
    slide9(data, companiesCompetitors);
    currentSlide = 9;
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000);
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide9 div:first').addClass('active-slide-no-square');
  });
}

let initBarGraph = function () {

  let barGraphWidth = barGraphParams['barGraphWidth'];
  let barGraphHeight = barGraphParams['barGraphHeight'];

  updateXScale(barGraphWidth);
  updateYScale(-15, 50);

  let totalWidth = barGraphWidth + margin.left + margin.right,
      totalHeight = barGraphHeight + margin.top + margin.bottom;

  let barGraph = d3.select('.bar-graph-wrapper')
      .append('svg')
        .attr('class', 'bar-graph')
        .attr('width', totalWidth)
        .attr('height', totalHeight)
      .append('g')
        .attr('class', 'bar-graph-elements')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  barGraph
    .append('g')
    .attr('class', 'y-axis axis');

  let y = barGraphParams['y'],
      x = barGraphParams['x'];

  barGraph
    .append('text')
    .attr('class', 'company-label')
    .attr('dx', 5)
    .attr('y', y(-7))
    .style('font-size', '50px');

  let yDomain = barGraphParams['y'].domain(),
      barGraphTextY = yDomain[yDomain.length - 1];

  barGraph
    .append('text')
    .attr('class', 'bar-graph-text')
    .attr('y', y(barGraphTextY))
    .style('font-size', '50px');

  barGraph
    .append('g')
      .attr('class', 'x-axis axis')
      .attr('transform', 'translate(0,' + y(0) + ')')
      .append('line')
      .attr('x1', 0)
      .attr('x2', barGraphWidth)
      .style('opacity', 0);
}

let updateBarGraphText = function (text) {
  let barGraphWidth = barGraphParams['barGraphWidth'];
  d3.select('.bar-graph-text')
    .text(text)
    .attr('dx', function () {
      console.log(this.getComputedTextLength());
      return barGraphWidth - this.getComputedTextLength();
    });
}

let resizeBarGraph = function () {

  margin = {
    top: 50,
    right: 80,
    left: 80
  };

  margin.bottom = mapModeHeight ? 40 : 100;

  let barGraphWidth = $('.bar-graph-viewer').width() - margin.left - margin.right,
      barGraphHeight;

  if (mapModeHeight) {
    slideInProgress = false;
    removeBarGraphClicks();
  }
  else
    addBarGraphClicks();

  if (mapModeHeight)
    barGraphHeight = mapModeHeight - margin.top - margin.bottom;
  else
    barGraphHeight = $('.bar-graph-viewer').height() - margin.top - margin.bottom;

  if (barGraphHeight < 0)
    return;

  barGraphParams['barGraphWidth'] = barGraphWidth;
  barGraphParams['barGraphHeight'] = barGraphHeight;

  let totalWidth = barGraphWidth + margin.left + margin.right,
      totalHeight = barGraphHeight + margin.top + margin.bottom;

  updateXScale(barGraphWidth);
  updateYScale(-15, 50);

  d3.select('.bar-graph')
      .transition()
      .duration(1000)
      .attr('width', totalWidth)
      .attr('height', totalHeight);

  let y = barGraphParams['y'];

  d3.select('.bar-graph-text')
    .attr('dx', function () {
      return barGraphWidth - this.getComputedTextLength();
    });

  d3.select('.company-label')
    .attr('dx', 5)
    .attr('y', y(-7))
    .style('font-size', 50);

  let chain = Promise.resolve();

  if (mapModeHeight) {
    chain = chain.then( function () {
      return highlightAllBars('#000', 0);
    });
  }

  chain
  .then( function () {
    console.log(barGraphParams);
    Promise.all([
      updatePercentLine('35', 1000),
      updateYAxis([-15, 35, 50], 1000),
      updateXAxis(1000),
      updateBars(0, 1000, 1000)
    ])
  })

  if (slideInProgress && !mapModeHeight) {
    chain = chain
    .then( function () {
        return fadeAll(1000);
    })
    .then( function () {
      if (slideInProgress && !mapModeHeight)
        return showAll(1000);
    })
    .then( function () {
      if (slideInProgress && !mapModeHeight) {
        slideInProgress = false;
        currentSlide -= 1;
        $('.bar-graph-viewer').trigger( "click" );
      }
    })
  }
}

let updateXScale = function () {
  let barGraphWidth = barGraphParams['barGraphWidth'];
  barGraphParams['x'] = d3.scaleBand()
                          .range([0, barGraphWidth, .1, 1]);
}

let updateYScale = function (domainStart, domainEnd) {
  let barGraphHeight = barGraphParams['barGraphHeight'];
  barGraphParams['y'] = d3.scaleLinear()
                          .domain([domainStart, domainEnd])
                          .range([barGraphHeight, 0]);
}

let addPercentLine = function (y, percent, duration, barGraphWidth) {
  d3.select('.bar-graph-elements')
    .append('line')
    .attr('class', function () {
      return 'percent-line percent' + percent;
    })
}

let updatePercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let barGraphWidth = barGraphParams['barGraphWidth'],
        y = barGraphParams['y'];

    d3.selectAll('.percent-line')
        .transition()
        .duration(duration)
        .attr('x1', 0)
        .attr('x2', barGraphWidth)
        .attr('y1', y(35))
        .attr('y2', y(35));
  });
}

let slidePercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let percentClass = '.percent' + percent;
    let y = barGraphParams['y'];
    let barGraphWidth = barGraphParams['barGraphWidth'];
    if (d3.select(percentClass).empty()) {
      addPercentLine(y, percent, duration, barGraphWidth);

      d3.select('.percent' + percent)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', y(percent))
        .attr('y2', y(percent))
        .transition()
        .duration(duration)
        .attr('x2', barGraphWidth)
        .end(resolve);
    }
    else {
      resolve();
    }

  });
}

let fadeOutPercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let percentClass = '.percent' + percent;

    d3.select(percentClass)
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .remove()
      .end(resolve);
  });
}

let updateXAxis = function (duration) {
  return new Promise( function (resolve, reject) {
    let data = barGraphParams['data'],
        x = barGraphParams['x'],
        y = barGraphParams['y'],
        yParam = barGraphParams['yParam'];

    let sortedData = data.slice(0).sort(function(a,b) { return b[yParam] - a[yParam]; });
    x.domain(sortedData.map(function(d) {
        return d.company_name;
    }));

    let xAxis = d3.axisBottom()
      .tickFormat('')
      .tickSize(0)
      .scale(x);

    d3.select('.x-axis')
      .transition()
      .duration(duration)
      .attr('transform', 'translate(0,' + y(0) + ')')
      .style('opacity', 1)
      .call(xAxis)
      .end(resolve);
    });
}

let updateYAxis = function (tickValues, duration) {
  return new Promise( function (resolve, reject) {
    let y = barGraphParams['y'];

    let yAxis = d3.axisLeft()
        .tickValues(tickValues)
        .tickFormat( function (d) {
          return d + '%';
        })
        .tickSize(0)
        .scale(y);

    d3.select('.y-axis')
      .transition()
      .duration(duration)
      .call(yAxis)
      .end(resolve);
  });
}

let updateBars = function (exitTime, enterTime, updateTime) {
  return new Promise( function (resolve, reject) {

    let data = barGraphParams['data'],
        x = barGraphParams['x'],
        y = barGraphParams['y'],
        yParam = barGraphParams['yParam'];

    let barGraph = d3.select('.bar-graph-elements');
    let bars = barGraph.selectAll('.bar')
      .data(data, function(d) {
        return d['company_name']
      });

    let exit = function () {
      return new Promise( function (resolve, reject) {
        bars
          .exit()
          .transition()
          .duration(exitTime)
          .attr('y', y(0))
          .attr('height', 0)
          .remove()
          .end(function () {
            resolve();
          });
      });
    }

    let enter = function () {
      return new Promise( function (resolve, reject) {
                      bars
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .on('mouseover', function(d){
                          d3.select('.company-label')
                            .transition()
                            .text(d['company_name']);
                        })
                        .on('mouseout', function(d){
                          d3.select('.company-label')
                            .transition()
                            .text('');
                        })
                        .call(updateBarSize)
                        .style('opacity', 0)
                        .transition()
                        .duration(enterTime)
                        .style('opacity', 1)
                        .end( function () {
                          resolve();
                        });
      });
    }

    let update = function () {
      return new Promise( function (resolve, reject) {
                      bars
                        .transition()
                        .delay(exitTime)
                        .duration(updateTime)
                        .call(updateBarSize)
                        .end(function () {
                          resolve();
                        });
      });
    }

    Promise
      .all([exit(), enter(), update()])
      .then(resolve);

  });
}

let updateBarSize = function (bars) {

    let x = barGraphParams['x'],
        y = barGraphParams['y'],
        yParam = barGraphParams['yParam'],
        width = barGraphParams['barGraphWidth'],
        data = barGraphParams['data'];

  bars
    .attr('x', function(d) {
      return x(d['company_name']);
    })
    .attr('y', function(d) {
      if (d[yParam] > 0){
        return y(d[yParam]);
      } else {
        return y(0);
      }
    })
    .attr('width', width / (data.length + 100))
    .attr('height', function(d) {
      return Math.abs(y(d[yParam]) - y(0));
    })
}

let highlightSomeBars = function (data, color, duration) {
  return new Promise( function (resolve, reject) {
    let bars = d3.selectAll('.bar')
                  .filter( function (d) {
                    return data.indexOf(d) > -1;
                  });
    highlightBars(bars, color, duration)
      .then(resolve);
  });
}

let highlightBarsBelow = function (yParam, limit, color, duration) {
  let bars = d3.selectAll('.bar')
                .filter( function (d) {
                  return d[yParam] < limit;
                });
  highlightBars(bars, color, duration);
}

let highlightBarsSplit = function (yParam, limit, colorLow, colorHigh, duration) {
  return new Promise( function (resolve, reject) {
    d3.selectAll('.bar')
      .transition()
      .duration(duration)
      .style('fill', function (d) {
        if (d[yParam] > limit) {
          return colorHigh;
        }
        else {
          return colorLow; 
        }
      })
      .end(resolve);
    });
}

let highlightAllBars = function (color, duration) {
  return new Promise( function (resolve, reject) {
    let bars = d3.selectAll('.bar');
    highlightBars(bars, color, duration)
      .then(resolve);
  });
}

let highlightBars = function (bars, color, duration) {
  return new Promise( function (resolve, reject) {
    bars
      .transition()
      .duration(duration)
      .style('fill', color)
      .end(resolve);
  });
}

let fadeAll = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph-elements')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

let showAll = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph-elements')
      .transition()
      .duration(duration)
      .style('opacity', 1)
      .end(resolve);
  });
}

let fadeOpeningScreen = function(duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.opening-screen')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

let showOpeningScreen = function(duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.opening-screen')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .end(resolve);
  });
}

let slide1 = function () {

  fadeAll(500, data)
  .then( function () {
    d3.select('.bar-graph-elements')
      .style('opacity', 0);
    showAll(1000);
  })
  .then( function () {
    let barGraphWidth = barGraphParams['barGraphWidth'],
        barGraphHeight = barGraphParams['barGraphHeight'];

    let barGraph = d3.select('.bar-graph-elements');

    let openingScreen = barGraph
                          .append('g')
                          .attr('class', 'opening-screen');

    openingScreen
      .append('text')
      .attr('class', 'intro-text')
      .attr('x', barGraphWidth / 2)
      .attr('y', barGraphHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '26px')
      .text('Corporate Tax Reality');

    openingScreen
      .append('text')
      .attr('class', 'intro-text')
      .attr('x', barGraphWidth / 2)
      .attr('y', barGraphHeight * 0.8)
      .style('text-anchor', 'middle')
      .style('font-size', '26px')
      .text('Visualizing the Federal Tax Rates for 258 Fortune 500 Companies');
  })
}

let slide2 = function (data) {
  let barGraph = d3.select('.bar-graph-elements');
  slideInProgress = true;

  d3.select('.intro-text')
    .style('opacity', 0);

  fadeStart(100, data)
  .then( function () {
    return updateYAxis([0,35], 0);
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

let updateBarGraphParam = function (param, value) {
  return new Promise( function (resolve, reject) {
    barGraphParams[param] = value;
    resolve();
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
      updateYAxis([0,20,35], 1000),
      updateBars(1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-15, 20),
      updateYAxis([-15,0,20,35], 1000),
      updateXAxis(1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-15, 20),
      updateYAxis([-15,0,20,35], 1000),
      updateBars(0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYScale(-70, 2000),
      updateYAxis([-70, 0, 500, 1000, 1500, 2000], 1000),
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
      updateYAxis([-70,0], 1000),
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

let fadeStart = function (duration, data) {
  return new Promise( function (resolve, reject) {

    let chain = Promise.resolve();
    chain
    .then( function () {
        // updateYScale(-15, 50)
      // if (mapModeHeight) {
        // mapModeHeight = $('.graph-viewers').outerHeight();
        // return resizeBarGraph();
      // }
    })
    .then( function () {
      if (shouldFade)
        return fadeAll(duration);
    })
    .then( function () {
      return Promise.all([
        updateYScale(-15, 50),
        updateBarGraphParam('data', data),
        updateBarGraphParam('yParam', 'rate'),
        slidePercentLine('35', 1000),
        highlightAllBars('#000', 1000),
        updateYAxis([0,35], 1000),
        updateXAxis(1000)
      ]);
    })
    .then( function () {
      return updateBars(0, 1000, 1000);
    })
    .then( function () {
      if (shouldFade) {
        shouldFade = false;
        return showAll(duration);
      }
    })
    .then(resolve);
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
      updateYAxis([-40,0,40], 1000),
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
