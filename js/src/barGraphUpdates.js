let updateBarGraphText = function (duration) {
  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'],
      text = barGraphParams['barGraphTextValue'],
      x = barGraphParams['barGraphTextX'],
      barGraphText = d3.select('.bar-graph-text'),
      showableElements = barGraphText;

  return new Promise( function (resolve, reject) {
    barGraphText
      .attr('x', barGraphWidth * x)
      .text( function () {
        if (text) return text;
      })
      .style('font-size', function () {
        if (text == 'Click to continue')
          return '1.7vw';
        else
          return '1.5vw';
      })
      .style('font-style', 'italic');

    let barGraphTextLength = barGraphText.node().getBBox().width;

    showableElements
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .style('opacity', 1)
      .end(resolve);

  });
}

let hideBarGraphText = function (duration) {
  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphText = d3.selectAll('.bar-graph-text');

  return new Promise( function (resolve, reject) {
    barGraphText
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .style('opacity', 0)
      .end(resolve);
  });
}

let updateXScale = function () {
  let barGraphWidth = barGraphParams['barGraphWidth'];
  barGraphParams['x'] = d3.scaleBand()
                          .range([0, barGraphWidth]);
}

let updateYScale = function () {
  let domainStart = barGraphParams['domainStart'],
      domainEnd = barGraphParams['domainEnd'],
      barGraphHeight = barGraphParams['barGraphHeight'];
  barGraphParams['y'] = d3.scaleLinear()
                          .domain([domainStart, domainEnd])
                          .range([barGraphHeight, 0]);
}

let updatePercentLine = function (duration) {
  return new Promise( function (resolve, reject) {
    let barGraphWidth = barGraphParams['barGraphWidth'],
        y = barGraphParams['y'],
        percentLine = d3.select('.percent-line');

    if (percentLine.style('opacity') == 0 && !inMapMode) {
      percentLine
        .style('opacity', 1)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', y(35))
        .attr('y2', y(35))
        .transition()
        .duration(duration)
        .attr('x2', barGraphWidth)
        .end(resolve);
    }
    else {
      percentLine
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('x1', 0)
        .attr('x2', barGraphWidth)
        .attr('y1', y(35))
        .attr('y2', y(35))
        .end(resolve);
    }
  });
}

let updateXAxis = function (duration, hide) {
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
      .ease(d3.easeLinear)
      .attr('transform', 'translate(0,' + y(0) + ')')
      .style('opacity', function () {
        return hide ? 0 : 1;
      })
      .call(xAxis)
      .end(resolve);
    });
}

let updateYAxis = function (duration, hide) {
  return new Promise( function (resolve, reject) {
    let y = barGraphParams['y'],
        tickValues = barGraphParams['tickValues'],
        axisEnding = barGraphParams['axisEnding'];

    let yAxis = d3.axisLeft()
        .tickValues(tickValues)
        .tickFormat( function (d) {
          return d + axisEnding;
        })
        .tickSize(0)
        .scale(y);

    d3.select('.y-axis')
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .call(yAxis)
      .style('opacity', function () {
        return hide ? 0 : 1;
      })
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
          .ease(d3.easeLinear)
          .attr('y', y(0))
          .attr('height', 0)
          .remove()
          .end(resolve);
      });
    }

    let enter = function () {
      return new Promise( function (resolve, reject) {
                      bars
                        .enter()
                        .append('rect')
                        .attr('class', function (d) {
                          return 'bar ' + slugify(d['company_name']);
                        })
                        .on('mouseover', function (d) {
                          if (inMapMode && allRegionsDrawn && d != currentCompany) {
                            updateCompanyLabel(300, d['company_name']);

                            d3.select(this)
                              .style('fill', 'yellow')
                              .style('stroke', 'yellow');
                          }
                        })
                        .on('mouseout', function (d) {
                          if (inMapMode && allRegionsDrawn && d != currentCompany) {
                            updateCompanyLabel(300, '');

                            let color;
                            if (d['rate'] > 35) {
                              color = 'rgba(0,0,0,0.4)';
                            }
                            else {
                              color = '#0FEA00'; 
                            }

                            d3.select(this)
                              .style('fill', color)
                              .style('stroke', 'black');
                          }
                        })
                        .on('click', function (d) {
                          if (inMapMode && allRegionsDrawn) {
                            currentCompany = d;

                            d3.selectAll('.bar')
                              .style('fill', function (d2) {
                                if (d2['rate'] > 35)
                                  return 'rgba(0,0,0,0.4)';
                                else
                                  return '#0FEA00';
                              })

                            d3.select(this)
                              .style('fill', 'yellow')
                              .style('stroke', 'black');

                            let companyName = d['company_name'];
                            openMapView(allCompanyData, companyName);
                          }
                        })
                        .call(updateBarSize)
                        .style('opacity', 0)
                        .transition()
                        .duration(enterTime)
                        .ease(d3.easeLinear)
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
                        .ease(d3.easeLinear)
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
    .style('stroke', 'black')
    .style('stroke-width', 0.5)
    .attr('width', width / (data.length + 100))
    .attr('height', function(d) {
      return Math.abs(y(d[yParam]) - y(0));
    })
}

let updateBarGraphParam = function (param, value) {
  return new Promise( function (resolve, reject) {
    barGraphParams[param] = value;
    resolve();
  });
}

let updateBarGraphSVG = function (duration) {

  let totalWidth = barGraphParams['totalWidth'],
      totalHeight = barGraphParams['totalHeight'];

  d3.select('.bar-graph')
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('width', totalWidth)
      .attr('height', totalHeight);
}

let updateCompanyLabel = function (duration, text = null, xValue = 5, yValue = -20) {
  let y = barGraphParams['y'];

  return new Promise( function (resolve, reject) {
    d3.select('.company-label')
      .attr('x', xValue)
      .attr('y', y(yValue))
      .transition()
      .duration(300)
      .style('opacity', 0)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .call( function (d) {
        if (text != null)
          d.text(text);
      })
      .style('opacity', 1)
      .end(resolve);
  });
}

let updateBarGraphDims = function (mapModeHeight) {
  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginLeft = barGraphParams['marginLeft'],
      marginBottom = barGraphParams['marginBottom'],
      barGraphWidth = $('.bar-graph-viewer').width() - marginLeft - marginRight;

  // console.log(barGraphWidth);

  if (!mapModeHeight)
    mapModeHeight = $('.bar-graph-viewer').height();

  let barGraphHeight = mapModeHeight - marginTop - marginBottom,
      totalWidth = barGraphWidth + marginLeft + marginRight,
      totalHeight = barGraphHeight + marginTop + marginBottom;

  updateBarGraphParam('barGraphWidth', barGraphWidth);
  updateBarGraphParam('barGraphHeight', barGraphHeight);
  updateBarGraphParam('totalWidth', totalWidth);
  updateBarGraphParam('totalHeight', totalHeight);
}

let restartSlide = function (duration) {
  fadeAll(duration)
    .then( function () {
      showAll(duration);
      slideInProgress = false;
      currentSlide -= 1;
      $('.bar-graph-viewer').trigger('click');
    });
}

let updateBarGraphYLabel = function (duration, customText) {
  let marginLeft = barGraphParams['marginLeft'],
      barGraphHeight = barGraphParams['barGraphHeight'],
      yParam = barGraphParams['yParam'];
      if (customText)
        yParam = null;

  let yLabels = {
    'rate': 'Effective Tax Rate (2008-2015)',
    'tax_break': 'Total Tax Break (2008-2015)',
    'adjusted_emp_change': 'Adjusted change in employees (% 2008-2016)',
    'us_foreign_diff': 'US tax rate - Foreign tax rate',
  }

  return new Promise( function (resolve, reject) {
    if (d3.select('.y-label').text() != yLabels[yParam]) {
          console.log(yParam);
      d3.select('.y-label')
        .attr('transform', 'translate('+ ( marginLeft * -0.5 ) + ',' + ( barGraphHeight * 0.5 )+')rotate(-90)')
        .style('opacity', 0)
        .text( function () {
          if (customText)
            return customText;

          return yLabels[yParam];
        })
        .transition()
        .duration(duration)
        .style('opacity', 1)
        .end( function () {
          resolve();
        });
    }
    else {
      d3.select('.y-label')
        .attr('transform', 'translate('+ ( marginLeft * -0.5 ) + ',' + ( barGraphHeight * 0.5 )+')rotate(-90)')
        .text(yLabels[yParam]);

      resolve();

    }
  });
}

let hideBarGraphYLabel = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.y-label')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}
