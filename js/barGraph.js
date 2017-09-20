var slugify = function (string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

var createSlides = function (data,
                             companiesYearsNoTax,
                             companiesTop25,
                             companiesRebates,
                             companiesIPS,
                             companiesTop3EmpChanges,
                             companiesLostEmployees,
                             companiesForeignDiff,
                             companiesCompetitors) {
  var margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 50
  },
  width = 920 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  var barGraphSettings = initBarGraph(margin, width, height, data),
      x = barGraphSettings[0],
      y = barGraphSettings[1];

  $('#slide1').click( function (e) {
    slide1(width, height);
  });

  $('#slide2').click( function (e) {
    slide2(width, x, y, data);
  });

  $('#slide3').click( function (e) {
    slide3(width, x, y, data, companiesYearsNoTax);
  });

  $('#slide4').click( function (e) {
    slide4(width, x, y, data, companiesTop25);
  });

  $('#slide5').click( function (e) {
    slide5(width, x, y, data, companiesRebates);
  });

  $('#slide6').click( function (e) {
    slide6(width, height, x, y, data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees);
  });

  $('#slide7').click( function (e) {
    slide7(width, x, y, data);
  });

  $('#slide8').click( function (e) {
    slide8(width, height, x, y, data, companiesForeignDiff);
  });

  $('#slide8interim').click( function (e) {
    slide8interim(width, height, x, y, data, companiesForeignDiff);
  });

  $('#slide9').click( function (e) {
    slide9(width, height, x, y, data, companiesCompetitors);
  });
}

var initBarGraph = function (margin, width, height, data) {

  var barGraph = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('class', 'bar-graph')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  barGraph
    .append('g')
    .attr('class', 'y-axis axis');

  var y = updateYScale(-15, 50, height);

  var x = d3.scaleBand()
      .range([0, width, .1, 1]);

  barGraph
    .append('g')
    .attr('class', 'x-axis axis')
    .attr('transform', 'translate(0,' + y(0) + ')')
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .style('opacity', 0)

    return [x, y];
}

var updateYScale = function (domainStart, domainEnd, height) {
  return d3.scaleLinear()
          .domain([domainStart, domainEnd])
          .range([height, 0]);
}

var addPercentLine = function (y, percent, duration, width) {
  d3.select('.bar-graph')
    .append('g')
    .append('line')
    .attr('class', function () {
      return 'percent-line percent' + percent;
    })
}

var slidePercentLine = function (y, percent, duration, width) {
  return new Promise( function (resolve, reject) {
    addPercentLine(y, percent, duration, width);

    d3.select('.percent' + percent)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', y(percent))
      .attr('y2', y(percent))
      .transition()
      .duration(duration)
      .attr('x2', width)
      .end(resolve);
  });
}

var fadeInPercentLine = function (y, percent, duration, width) {
  return new Promise( function (resolve, reject) {
    var percentClass = '.percent' + percent;

    if (d3.select(percentClass).empty()) {
      addPercentLine(y, percent, duration, width);
      d3.select(percentClass)
        .attr('x1', 0)
        .attr('x2', width)
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

var updateXAxis = function (x, y, yParam, data, duration) {
  return new Promise( function (resolve, reject) {
    data = data.sort(function(a,b) { return b[yParam] - a[yParam]; });
    x.domain(data.map(function(d) {
        return d.company_name;
    }));

    var xAxis = d3.axisBottom()
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

var updateYAxis = function (tickValues, y, duration) {
  return new Promise( function (resolve, reject) {
    var yAxis = d3.axisLeft()
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

var updateBars = function (data, yParam, x, y, exitTime, enterTime, updateTime) {
  return new Promise( function (resolve, reject) {
    var barGraph = d3.select('.bar-graph');
    var bars = barGraph.selectAll('.bar')
      .data(data, function(d) {
        return d['company_name']
      });

    var exit = function () {
      return new Promise( function (resolve, reject) {
        bars
          .exit()
          .transition()
          .duration(exitTime)
          .attr('y', y(0))
          .attr('height', 0)
          .remove()
          .end(function () {
            console.log('exit')
            resolve();
          });
      });
    }

    var enter = function () {
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

    var update = function () {
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

var updateBarParams = function (bars, x, y, yParam) {
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

var highlightSomeBars = function (data, color, duration) {
  return new Promise( function (resolve, reject) {
    var bars = d3.selectAll('.bar')
                  .filter( function (d) {
                    return data.indexOf(d) > -1;
                  });
    highlightBars(bars, color, duration)
      .then(resolve);
  });
}

var highlightBarsBelow = function (yParam, limit, color, duration) {
  var bars = d3.selectAll('.bar')
                .filter( function (d) {
                  return d[yParam] < limit;
                });
  highlightBars(bars, color, duration);
}

var highlightBarsSplit = function (yParam, limit, colorLow, colorHigh, duration) {
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

var highlightAllBars = function (color, duration) {
  return new Promise( function (resolve, reject) {
    var bars = d3.selectAll('.bar');
    highlightBars(bars, color, duration)
      .then(resolve);
  });
}

var highlightBars = function (bars, color, duration) {
  return new Promise( function (resolve, reject) {
    bars
      .transition()
      .duration(duration)
      .style('fill', color)
      .end(resolve);
  });
}

var fadeAll = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

var showAll = function () {
  return new Promise( function (resolve, reject) {
    d3.select('.bar-graph')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .end(resolve);
  });
}

var slide1 = function (width, height) {
  var barGraph = d3.select('.bar-graph');

  var openingScreen = barGraph
                        .append('g')
                        .attr('class', 'opening-screen');

  openingScreen
    .append('text')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .style('text-anchor', 'middle')
    .style('font-size', '26px')
    .text('Corporate Tax Reality');

  openingScreen
    .append('text')
    .attr('x', width / 2)
    .attr('y', height * 0.8)
    .style('text-anchor', 'middle')
    .style('font-size', '26px')
    .text('Visualizing the Federal Tax Rates for 258 Fortune 500 Companies');
}

var slide2 = function (width, x, y, data) {
  var barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    slidePercentLine(y, 35, 1000, width)
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

var slide3 = function (width, x, y, data, companiesYearsNoTax) {
  var barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    fadeInPercentLine(y, 35, 1000, width)
  ])
  .then( function () {
    return updateBars(data, 'rate', x, y, 0, 1000, 1000);
  })
  .then(function () {
    var chain = Promise.resolve();
    for (let ii = Object.keys(companiesYearsNoTax).length; ii > 0; ii--) {
      chain = chain.then(function () {
                return highlightSomeBars(companiesYearsNoTax[ii], 'red', 1000);
              });
    }
    return chain;
  });
}

var slide4 = function (width, x, y, data, companiesTop25) {
  var barGraph = d3.select('.bar-graph');

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

var slide5 = function (width, x, y, data, companiesRebates) {
  var barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([0,35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000)
  ])
  .then( function () {
    return updateBars(data,'rate', x, y, 0, 1000, 1000);
  })
  .then( function () {
    var chain = Promise.resolve();
    var rebates = Object.keys(companiesRebates);
    var lastRebate = rebates[rebates.length - 1];
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

var slide6 = function (width,
                       height,
                       x,
                       y,
                       data,
                       companiesIPS,
                       companiesTop3EmpChanges,
                       companiesLostEmployees) {

  var barGraph = d3.select('.bar-graph');

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
      y = updateYScale(-15, 20, height),
      updateYAxis([-15,0,20,35], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'rate', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-15, 20, height),
      updateYAxis([-15,0,20,35], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'rate', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return Promise.all([
      y = updateYScale(-70, 2000, height),
      updateYAxis([-70, 0, 500, 1000, 1500, 2000], y, 1000),
      updateXAxis(x, y, 'rate', companiesIPS, 1000),
      updateBars(companiesIPS, 'adjusted_emp_change', x, y, 0, 1000, 1000),
    ]);
  })
  .then( function () {
    var chain = Promise.resolve();
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
      y = updateYScale(-70, 0, height),
      updateXAxis(x, y, 'adjusted_emp_change', companiesLostEmployees, 1000),
      updateYAxis([-70,0], y, 1000),
      updateBars(companiesLostEmployees, 'adjusted_emp_change', x, y, 0, 1000, 1000)
    ]);
  })
  .then( function () {
    return highlightAllBars('#000', 1000);
  });
}

var slide7 = function (width, x, y, data) {
  var barGraph = d3.select('.bar-graph');

  Promise.all([
    highlightAllBars('#000', 1000),
    updateYAxis([35], y, 1000),
    updateXAxis(x, y, 'rate', data, 1000),
    slidePercentLine(y, 35, 1000, width)
  ])
  .then( function () {
    return Promise.all([
      updateYAxis([0,35], y, 1000),
      updateBars(data,'rate', x, y, 0, 1000, 1000)
    ])
  });
}

var slide8 = function (width, height, x, y, data, companiesForeignDiff) {
  var barGraph = d3.select('.bar-graph');

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
      y = updateYScale(-40, 40, height),
      updateXAxis(x, y, 'us_foreign_diff', companiesForeignDiff, 1000),
      updateYAxis([-40,0,40], y, 1000),
      updateBars(companiesForeignDiff, 'us_foreign_diff', x, y, 0, 1000, 1000)
    ])
  })
  .then( function () {
    return highlightBarsSplit('us_foreign_diff', 0, 'red', 'green', 1000);
  });
}

var slide9 = function (width, height, x, y, data, companiesCompetitors) {
  var barGraph = d3.select('.bar-graph');

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
    var chain = Promise.resolve();
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
