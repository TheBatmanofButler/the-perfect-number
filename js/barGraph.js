let createSlides = function (data,
                             companiesYearsNoTax,
                             companiesTop25,
                             companiesRebates,
                             companiesIPS,
                             companiesTop3EmpChanges,
                             companiesLostEmployees,
                             companiesForeignDiff,
                             companiesCompetitors) {
  
 
  // console.log($('.bar-graph-viewer').barGraphHeight())
  // barGraphWidth = gridDiv.clientbarGraphWidth;
  // barGraphHeight = gridDiv.clientbarGraphHeight;
  let margin = {
      top: 50,
      right: 80,
      bottom: 200,
      left: 80
  },
      barGraphWidth = $('.bar-graph-viewer').width() - margin.left - margin.right,
      barGraphHeight = $('.bar-graph-viewer').height() - margin.top - margin.bottom;

  let barGraphSettings = initBarGraph(margin, barGraphWidth, barGraphHeight, data),
      x = barGraphSettings[0],
      y = barGraphSettings[1];

  $('#slide1').click( function (e) {
    slide1(barGraphWidth, barGraphHeight);
    currentSlide = 1;
  });

  $('#slide2').click( function (e) {
    slide2(barGraphWidth, x, y, data);
    currentSlide = 2;
  });

  $('#slide3').click( function (e) {
    slide3(barGraphWidth, x, y, data, companiesYearsNoTax);
    currentSlide = 3;
  });

  $('#slide4').click( function (e) {
    slide4(barGraphWidth, x, y, data, companiesTop25);
    currentSlide = 4;
  });

  $('#slide5').click( function (e) {
    slide5(barGraphWidth, x, y, data, companiesRebates);
    currentSlide = 5;
  });

  $('#slide6').click( function (e) {
    slide6(barGraphWidth, barGraphHeight, x, y, data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees);
    currentSlide = 6;
  });

  $('#slide7').click( function (e) {
    slide7(barGraphWidth, x, y, data);
    currentSlide = 7;
  });

  $('#slide8').click( function (e) {
    slide8(barGraphWidth, barGraphHeight, x, y, data, companiesForeignDiff);
    currentSlide = 8;
  });

  $('#slide9').click( function (e) {
    slide9(barGraphWidth, barGraphHeight, x, y, data, companiesCompetitors);
    currentSlide = 9;
  });
}

let initBarGraph = function (margin, barGraphWidth, barGraphHeight, data) {

  let barGraph = d3.select('.bar-graph-wrapper').append('svg')
      .attr('width', barGraphWidth + margin.left + margin.right)
      .attr('height', barGraphHeight + margin.top + margin.bottom)
      .append('g')
      .attr('class', 'bar-graph')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  barGraph
    .append('g')
    .attr('class', 'y-axis axis');

  let y = updateYScale(-15, 50, barGraphHeight);

  let x = d3.scaleBand()
      .range([0, barGraphWidth, .1, 1]);

  barGraph
    .append('g')
    .attr('class', 'x-axis axis')
    .attr('transform', 'translate(0,' + y(0) + ')')
    .append('line')
    .attr('x1', 0)
    .attr('x2', barGraphWidth)
    .style('opacity', 0)

    return [x, y];
}

let updateYScale = function (domainStart, domainEnd, barGraphHeight) {
  return d3.scaleLinear()
          .domain([domainStart, domainEnd])
          .range([barGraphHeight, 0]);
}

let addPercentLine = function (y, percent, duration, barGraphWidth) {
  d3.select('.bar-graph')
    .append('g')
    .append('line')
    .attr('class', function () {
      return 'percent-line percent' + percent;
    })
}

let slidePercentLine = function (y, percent, duration, barGraphWidth) {
  return new Promise( function (resolve, reject) {
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

let fadeInPercentLine = function (y, percent, duration, barGraphWidth) {
  return new Promise( function (resolve, reject) {
    let percentClass = '.percent' + percent;

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

let updateXAxis = function (x, y, yParam, data, duration) {
  return new Promise( function (resolve, reject) {
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

let updateYAxis = function (tickValues, y, duration) {
  return new Promise( function (resolve, reject) {
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

let updateBars = function (data, yParam, x, y, exitTime, enterTime, updateTime) {
  return new Promise( function (resolve, reject) {
    let barGraph = d3.select('.bar-graph');
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
          .attr('barGraphHeight', 0)
          .remove()
          .end(function () {
            console.log('exit')
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
                          console.log(d['company_name']);
                        })
                        .call(updateBarParams, x, y, yParam)
                        .style('opacity', 0)
                        .transition()
                        .duration(enterTime)
                        .style('opacity', 1)
                        .end(function () {
                          console.log('enter')
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
                        .call(updateBarParams, x, y, yParam)
                        .end(function () {
                          console.log('update')
                          resolve();
                        });
      });
    }

    Promise
      .all([exit(), enter(), update()])
      .then(resolve);

  });
}

let updateBarParams = function (bars, x, y, yParam) {
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
    .attr('width', 2)
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
    d3.select('.bar-graph')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

let showAll = function () {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .end(resolve);
  });
}

let slide1 = function (barGraphWidth, barGraphHeight) {
  let barGraph = d3.select('.bar-graph');

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

let slide2 = function (barGraphWidth, x, y, data) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    slidePercentLine(y, 35, 1000, barGraphWidth)
  ])
  .then( function () {
    return Promise.all([
      updateYAxis([0,35], y, 1000),
      updateBars(data,'rate', x, y, 0, 1000, 1000)
    ])
  })
  .then( function () {
    return highlightBarsSplit('rate', 35, 'red', 'green', 1000);
  });
}

let slide3 = function (barGraphWidth, x, y, data, companiesYearsNoTax) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    fadeInPercentLine(y, 35, 1000, barGraphWidth)
  ])
  .then( function () {
    return updateBars(data, 'rate', x, y, 0, 1000, 1000);
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

let slide4 = function (barGraphWidth, x, y, data, companiesTop25) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
  ])
  .then( function () {
    return updateBars(data,'rate', x, y, 0, 1000, 1000);
  })
  .then( function () {
    return highlightSomeBars(companiesTop25, 'red', 1000);
  });
}

let slide5 = function (barGraphWidth, x, y, data, companiesRebates) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000)
  ])
  .then( function () {
    return updateBars(data,'rate', x, y, 0, 1000, 1000);
  })
  .then( function () {
    let chain = Promise.resolve();
    let rebates = Object.keys(companiesRebates);
    let lastRebate = rebates[rebates.length - 1];
    console.log(lastRebate)
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

let slide6 = function (barGraphWidth,
                       barGraphHeight,
                       x,
                       y,
                       data,
                       companiesIPS,
                       companiesTop3EmpChanges,
                       companiesLostEmployees) {

  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
  ])
  .then( function () {
    return updateBars(data,'rate', x, y, 0, 1000, 1000);
  })
  .then( function () {
    return Promise.all([
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateYAxis([0,20,35], y, 1000),
      updateBars(companiesIPS, 'rate', x, y, 1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-15, 20, barGraphHeight),
      updateYAxis([-15,0,20,35], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'rate', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-15, 20, barGraphHeight),
      updateYAxis([-15,0,20,35], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'rate', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-70, 2000, barGraphHeight),
      updateYAxis([-70, 0, 500, 1000, 1500, 2000], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'adjusted_emp_change', x, y, 0, 1000, 1000),
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
      y = updateYScale(-70, 0, barGraphHeight),
      updateXAxis(x, y, 'adjusted_emp_change', companiesLostEmployees, 1000),
      updateYAxis([-70,0], y, 1000),
      updateBars(companiesLostEmployees, 'adjusted_emp_change', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return highlightAllBars('#000', 1000);
  });
}

let slide7 = function (barGraphWidth, x, y, data) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    slidePercentLine(y, 35, 1000, barGraphWidth)
  ])
  .then( function () {
    return Promise.all([
      updateYAxis([0,35], y, 1000),
      updateBars(data,'rate', x, y, 0, 1000, 1000)
    ])
  });
}

let slide8 = function (barGraphWidth, barGraphHeight, x, y, data, companiesForeignDiff) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000)
  ])
  .then (function () {
    return updateBars(data, 'rate', x, y, 1000, 1000, 1000);
  })
  .then( function () {
    return Promise.all([
      highlightSomeBars(companiesForeignDiff, 'red', 1000),
      updateBars(companiesForeignDiff, 'us_foreign_diff', x, y, 1000, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-40, 40, barGraphHeight),
      updateXAxis(x, y, 'us_foreign_diff', companiesForeignDiff, 1000),
      updateYAxis([-40,0,40], y, 1000),
      updateBars(companiesForeignDiff, 'us_foreign_diff', x, y, 0, 1000, 1000)
    ])
  })
  .then( function () {
    return highlightBarsSplit('us_foreign_diff', 0, 'red', 'green', 1000);
  });
}

let slide9 = function (barGraphWidth, barGraphHeight, x, y, data, companiesCompetitors) {
  let barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 0),
    updateYAxis([0,35], y, 0),
    updateXAxis(x, y, 'rate', data, 0),
    updateBars(data, 'rate', x, y, 0, 1000, 1000),
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
