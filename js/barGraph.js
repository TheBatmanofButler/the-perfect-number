let barGraphParams = {
  barGraphWidth: null,
  barGraphHeight: null,
  x: null,
  y: null,
  yParam: null,
  data: null,
  marginTop: 50,
  marginRight: 80,
  marginBottom: 150,
  marginLeft: 80
}

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

  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'];

  let barGraphWidth = $('.bar-graph-viewer').width() - marginLeft - marginRight,
      barGraphHeight = $('.bar-graph-viewer').height() - marginTop - marginBottom;

  barGraphParams['barGraphWidth'] = barGraphWidth;
  barGraphParams['barGraphHeight'] = barGraphHeight;

  initBarGraph();

  $('#slide1').click( function (e) {
    slide1(barGraphWidth, barGraphHeight);
    currentSlide = 1;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide1 div:first').addClass('active-slide-no-square');
  });

  $('#slide2').click( function (e) {
    slide2();
    currentSlide = 2;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide2 div:first').addClass('active-slide-no-square');
  });

  $('#slide3').click( function (e) {
    slide3(companiesYearsNoTax);
    currentSlide = 3;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide3 div:first').addClass('active-slide-no-square');
  });

  $('#slide4').click( function (e) {
    slide4(companiesTop25);
    currentSlide = 4;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide4 div:first').addClass('active-slide-no-square');
  });

  $('#slide5').click( function (e) {
    slide5(companiesRebates);
    currentSlide = 5;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide5 div:first').addClass('active-slide-no-square');
  });

  $('#slide6').click( function (e) {
    slide6(companiesIPS, companiesTop3EmpChanges, companiesLostEmployees);
    currentSlide = 6;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide6 div:first').addClass('active-slide-no-square');
  });

  $('#slide7').click( function (e) {
    slide7(data);
    currentSlide = 7;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide7 div:first').addClass('active-slide-no-square');
  });

  $('#slide8').click( function (e) {
    slide8(companiesForeignDiff);
    currentSlide = 8;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide8 div:first').addClass('active-slide-no-square');
  });

  $('#slide9').click( function (e) {
    slide9(data, companiesCompetitors);
    currentSlide = 9;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide9 div:first').addClass('active-slide-no-square');
  });
}

let initBarGraph = function (margin) {
  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'];

  let barGraphWidth = barGraphParams['barGraphWidth'];
  let barGraphHeight = barGraphParams['barGraphHeight'];

  updateXScale(barGraphWidth);
  updateYScale(-15, 50);

  let totalWidth = barGraphWidth + marginLeft + marginRight,
      totalHeight = barGraphHeight + marginTop + marginBottom;

  let barGraph = d3.select('.bar-graph-wrapper')
      .append('svg')
        .attr('class', 'bar-graph')
        .attr('width', totalWidth)
        .attr('height', totalHeight)
      .append('g')
        .attr('class', 'bar-graph-elements')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

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

let resizeBarGraph2 = function (data, duration, ogBarGraphViewerHeight) {
  let margin = {
      top: 50,
      right: 80,
      bottom: 100,
      left: 80
  };
  let barGraphWidth = $('.bar-graph-viewer').width() - marginLeft - marginRight,
      barGraphHeight = $('.bar-graph-viewer').height() - 15 - 30;

  let totalWidth = barGraphWidth + marginLeft + marginRight,
      totalHeight = barGraphHeight + 15 + 30;

  d3.select('.bar-graph')
    .attr('width', totalWidth)
    .attr('height', totalHeight);

  updateXScale(barGraphWidth);
  updateYScale(-15, 50);

  d3.select('.bar-graph-elements')
      .attr('transform', 'translate(' + marginLeft + ',' + 15 + ')');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([-15, 35, 50], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000)
  ])
  .then( function () {
    return updateBars(data,'rate', x, y, 0, 1000, 1000);
  })

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

  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'];

  let barGraphWidth = $('.bar-graph-viewer').width() - marginLeft - marginRight;
  let barGraphHeight = $('.bar-graph-viewer').height() - marginTop - marginBottom;

  barGraphParams['barGraphWidth'] = barGraphWidth;
  barGraphParams['barGraphHeight'] = barGraphHeight;

  let totalWidth = barGraphWidth + marginLeft + marginRight,
      totalHeight = barGraphHeight + marginTop + marginBottom;

  if (barGraphHeight < 0)
    return;

  updateXScale(barGraphWidth);
  updateYScale(-15, 50);

  d3.select('.bar-graph')
      .attr('width', totalWidth)
      .attr('height', totalHeight);

  let y = barGraphParams['y'];

  d3.selectAll('.percent-line')
      .attr('x1', 0)
      .attr('x2', barGraphWidth)
      .attr('y1', y(35))
      .attr('y2', y(35));

  d3.select('.bar-graph-text')
    .attr('dx', function () {
      return barGraphWidth - this.getComputedTextLength();
    });

  Promise.all([
    updateYAxis([-15, 35, 50], 0),
    updateXAxis(0),
  ])
  .then( function () {
    return updateBars(0, 0, 0);
  });
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
    .append('g')
    .append('line')
    .attr('class', function () {
      return 'percent-line percent' + percent;
    })
}

let slidePercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let y = barGraphParams['y'];
    let barGraphWidth = barGraphParams['barGraphWidth'];
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
  });
}

let fadeInPercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let percentClass = '.percent' + percent;
    let y = barGraphParams['y'];
    let barGraphWidth = barGraphParams['barGraphWidth'];

    if (d3.select(percentClass).empty()) {
      addPercentLine(y, percent, duration, barGraphWidth);

      d3.select(percentClass)
        .attr('x1', 0)
        .attr('x2', barGraphWidth)
        .attr('y1', y(percent))
        .attr('y2', y(percent))
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .style('opacity', 1)
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
                        .end(function () {
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

let showAll = function () {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph-elements')
      .transition()
      .duration(1000)
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
  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'];

  let barGraph = d3.select('.bar-graph-elements');

  let openingScreen = barGraph
                        .append('g')
                        .attr('class', 'opening-screen');

  openingScreen
    .append('text')
    .attr('x', barGraphWidth / 2)
    .attr('y', barGraphHeight / 2)
    .style('text-anchor', 'middle')
    .style('font-size', '26px')
    .text('Corporate Tax Reality');

  openingScreen
    .append('text')
    .attr('x', barGraphWidth / 2)
    .attr('y', barGraphHeight * 0.8)
    .style('text-anchor', 'middle')
    .style('font-size', '26px')
    .text('Visualizing the Federal Tax Rates for 258 Fortune 500 Companies');
}

let slide2 = function () {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    updateBarGraphParam('yParam', 'rate'),
    highlightAllBars('#000', 1000),
    updateYAxis([35], 1000),
    updateXAxis(1000),
    slidePercentLine(35, 1000)
  ])
  .then( function () {
    return Promise.all([
      updateYAxis([0,35], 1000),
      updateBars(0, 1000, 1000)
    ])
  })
  .then( function () {
    return highlightBarsSplit('rate', 35, 'red', 'green', 1000);
  });
}

let slide3 = function (companiesYearsNoTax) {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    updateBarGraphParam('yParam', 'rate'),
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], 1000),
    updateXAxis(1000),
    fadeInPercentLine(35, 1000)
  ])
  .then( function () {
    return updateBars(0, 1000, 1000);
  })
  .then(function () {
    let chain = Promise.resolve();
    for (let ii = Object.keys(companiesYearsNoTax).length; ii > 0; ii--) {
      chain = chain.then(function () {
                return highlightSomeBars(companiesYearsNoTax[ii], 'red', 1000);
              });
    }
    return chain;
  });
}

let slide4 = function (companiesTop25) {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], 1000),
    updateXAxis(1000),
  ])
  .then( function () {
    return updateBars(0, 1000, 1000);
  })
  .then( function () {
    return highlightSomeBars(companiesTop25, 'red', 1000);
  });
}

let slide5 = function (companiesRebates) {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], 1000),
    updateXAxis(1000)
  ])
  .then( function () {
    return updateBars(0, 1000, 1000);
  })
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
  });
}

let updateBarGraphParam = function (param, value) {
  return new Promise( function (resolve, reject) {
    barGraphParams[param] = value;
    resolve();
  });
}

let slide6 = function (companiesIPS, companiesTop3EmpChanges, companiesLostEmployees) {

  let barGraph = d3.select('.bar-graph-elements');

  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'],
      x = barGraphParams['x'],
      y = barGraphParams['y'],
      data = barGraphParams['data'];

  Promise.all([
    fadeOutPercentLine('35', 1000),
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], 1000),
    updateXAxis(1000),
  ])
  .then( function () {
    return Promise.all([
      updateBarGraphParam('data', data),
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
  });
}

let slide7 = function (data) {
  let barGraph = d3.select('.bar-graph-elements');

  fadeAll(1000)
  .then( function () {
    return Promise.all([
      updateBarGraphParam('data', data),
      updateBarGraphParam('yParam', 'rate'),
      highlightAllBars('#000', 1000),
      updateYScale(-15, 50),
      updateYAxis([35], 1000),
      updateXAxis(1000),
      showAll(1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      slidePercentLine(35, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      updateYAxis([0,35], 1000),
      updateBarGraphParam('yParam', 'rate'),
      updateBars(0, 1000, 1000)
    ])
  });
}

let slide8 = function (companiesForeignDiff) {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], 1000),
    updateXAxis(1000)
  ])
  .then (function () {
    return updateBars(1000, 1000, 1000);
  })
  .then( function () {
    return Promise.all([
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
  });
}

let slide9 = function (data, companiesCompetitors) {
  let barGraph = d3.select('.bar-graph-elements');

  Promise.all([
    highlightAllBars('#000', 0),
    fadeOutPercentLine('35', 1000),
    updateBarGraphParam('data', data),
    updateBarGraphParam('yParam', 'rate'),
    updateYAxis([0,35], 0),
    updateXAxis(0),
    updateBars(0, 1000, 1000)
  ])
  .then( function () {
    return Promise.all([
      showAll()
    ])
  })
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
  });
}
