let updateBarGraphText = function (text, duration) {
  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphText = d3.select('.bar-graph-text');

  barGraphText
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr('dx', function () {
      return barGraphWidth - this.getComputedTextLength();
    });

  if (text) {
    barGraphText
      .text(text);    
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

let updatePercentLine = function (percent, duration) {
  return new Promise( function (resolve, reject) {
    let barGraphWidth = barGraphParams['barGraphWidth'],
        y = barGraphParams['y'];

    d3.selectAll('.percent-line')
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('x1', 0)
        .attr('x2', barGraphWidth)
        .attr('y1', y(35))
        .attr('y2', y(35))
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
      .ease(d3.easeLinear)
      .attr('transform', 'translate(0,' + y(0) + ')')
      .style('opacity', 1)
      .call(xAxis)
      .end(resolve);
    });
}

let updateYAxis = function (duration) {
  return new Promise( function (resolve, reject) {
    let y = barGraphParams['y'],
        tickValues = barGraphParams['tickValues'];

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
      .ease(d3.easeLinear)
      .call(yAxis)
      .style('opacity', 1)
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
                        .attr('class', function (d) {
                          return 'bar ' + slugify(d['company_name']);
                        })
                        .on('mouseover', function (d) {
                          d3.select('.company-label')
                            .transition()
                            .ease(d3.easeLinear)
                            .text(d['company_name']);
                        })
                        .on('mouseout', function (d) {
                          d3.select('.company-label')
                            .transition()
                            .ease(d3.easeLinear)
                            .text('');
                        })
                        .on('click', function (d) {
                          if (inMapMode) {
                            let companyName = d['company_name'];
                            let slugifyCompanyName = slugify(companyName);
                            let companyInfo = infoBoxData[slugifyCompanyName];

                            loadInfo(companyInfo);
                            initPropGraph(companyName);
                            updatePropGraph();
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

let updateCompanyLabel = function (duration) {
  let y = barGraphParams['y'];

  d3.select('.company-label')
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr('dx', 5)
    .attr('y', y(-7))
    .style('font-size', 50);
}

let updateBarGraphDims = function (mapModeHeight) {
  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginLeft = barGraphParams['marginLeft'],
      marginBottom = barGraphParams['marginBottom'],
      barGraphWidth = $('.bar-graph-viewer').width() - marginLeft - marginRight;

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