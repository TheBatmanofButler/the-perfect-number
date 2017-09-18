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
                             companiesIPS) {
  var margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
  },
  width = 920 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  var barGraphSettings = initBarGraph(margin, width, height, data),
      x = barGraphSettings[0],
      y = barGraphSettings[1];

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
    slide6(width, height, x, y, data, companiesIPS);
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

var updatePercentLine = function (y, percent, duration, width) {
  d3.select('.bar-graph')
    .append('g')
    .attr('class', 'percent-line')
    .append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', y(percent))
    .attr('y2', y(percent))
    .transition()
    .duration(duration)
    .attr('x2', width);
}

var updateXAxis = function (x, y, data, duration) {
  data = data.sort(function(a,b) { return b.rate - a.rate; });
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
    .call(xAxis);
}

var updateYAxis = function (tickValues, y, duration) {
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
    .call(yAxis);
}

var updateBars = function (data, x, y, exitTime, enterTime, updateTime, callback) {
    var barGraph = d3.select('.bar-graph');
    var bars = barGraph.selectAll('.bar')
      .data(data, function(d) {
        return d['company_name']
      });

    bars
      .exit()
      .transition()
      .duration(exitTime)
      .attr("y", y(0))
      .attr("height", 0)
      .remove();

    bars
      .enter()
      .append('rect')
      .attr('id', function(d) { 
          return slugify(d['company_name']) + '-path';
      })
      .attr('class', 'bar')
      .on('mouseover', function(d){
        console.log(d['company_name']);
      })
      .attr('x', function(d) {
          return x(d['company_name']);
      })
      .attr('y', function(d) {
          if (d['rate'] > 0){
              return y(d['rate']);
          } else {
              return y(0);
          }
      })
      .attr('width', 2)
      .attr('height', function(d) {
          return Math.abs(y(d['rate']) - y(0));
      })
      .style('opacity', 0)
      .transition()
      .duration(enterTime)
      .style('opacity', 1)
      .end( function () {
        if (callback) callback();
      });

    bars
      .transition()
      .delay(exitTime)
      .duration(updateTime)
      .attr('x', function(d) {
          return x(d['company_name']);
      })
      .attr('y', function(d) {
          if (d['rate'] > 0){
              return y(d['rate']);
          } else {
              return y(0);
          }
      })
      .attr('width', 2)
      .attr('height', function(d) {
          return Math.abs(y(d['rate']) - y(0));
      })

}

var slide6 = function (width, height, x, y, data, companiesIPS) {
  var barGraph = d3.select('.bar-graph');
  updateYAxis([0,35], y, 1000);
  updateXAxis(x, y, data, 1000);
  updateBars(data, x, y, 1000, 1000, 1000);

  setTimeout( function () {
    updateXAxis(x, y, companiesIPS, 1000);
    updateYAxis([0,20,35], y, 1000);
    updateBars(companiesIPS, x, y, 1000, 1000, 1000);

    setTimeout( function () {
      y = updateYScale(-15, 20, height);
      updateYAxis([-15,0,20,35], y, 1000);
      updateXAxis(x, y, companiesIPS, 1000);
      updateBars(companiesIPS, x, y, 0, 1000, 1000);
    }, 2000)

  }, 2000);

}

var highlightBars = function (data, subset, duration, color, callback) {
  
  if (data == subset) {
    console.log(1);
    var bar = d3.selectAll('.bar')
  }
  else {
    console.log(2);
    var bar = d3.selectAll('.bar')
      .filter( function (d) {
        return subset.indexOf(d) > -1;
      })
  }

  bar
    .transition()
    .duration(duration)
    .style('fill', color)
    .end( function () {
      if (callback) callback();
    });
}

var highlightBarsTimeout = function (data, subset, color, time) {
  setTimeout( function () {
    highlightBars(data, subset, 1000, color);
  }, time); 
}

var slide2 = function (width, x, y, data) {
  var barGraph = d3.select('.bar-graph');
  updateYAxis([35], y, 1000);
  updatePercentLine(y, 35, 3000, width)
  
  setTimeout( function () {
    updateYAxis([0,35], y, 1000);
    updateXAxis(y, 1000);
    updateBars(data, x, y);
  }, 3000);
}

var slide3 = function (width, x, y, data, companiesYearsNoTax) {
  var barGraph = d3.select('.bar-graph');
  updateYAxis([0,35], y, 1000);
  updateXAxis(y, 1000);
  updateBars(data, x, y);
  
  setTimeout( function () {
    for (var ii = 8; ii > 0; ii--) {
      var time = (9 - ii) * 1000;
      highlightBarsTimeout(data, companiesYearsNoTax[ii], 'red', time);
    }
  }, 1000);
}

var slide4 = function (width, x, y, data, companiesTop25) {
  var barGraph = d3.select('.bar-graph');
  updateYAxis([0,35], y, 1000);
  updateXAxis(y, 1000);
  updateBars(data, x, y);

  setTimeout( function () {
    highlightBars(data, companiesTop25, 1000, 'red');
  }, 1000);
}

var slide5 = function (width, x, y, data, companiesRebates) {
  var barGraph = d3.select('.bar-graph');
  updateYAxis([0,35], y, 1000);
  updateXAxis(y, 1000);

  var rebates = ['stockOptions','researchExperiment','dpad','accDepreciation','deferredTaxes'];
  updateBars(data, x, y);

  setTimeout( function () {
    var counter = 1;
    while (rebates.length > 0) {
      var rebate = rebates.shift();
      highlightBarsTimeout(data, companiesRebates[rebate], 'red', counter * 1000);

      counter++;
      highlightBarsTimeout(data, data, '#000', counter * 1000);
    }
  }, 1000);
}

var loadBarData = function (data) {
    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30
    },
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width, .1, 1]);

    var y = d3.scaleLinear()
        .domain([-15,50])
        .range([height,0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.format('d'));

    var yAxis = d3.axisLeft()
        .tickValues([0,35])
        .tickSize(0)
        .scale(y);

    data = data.sort(function(a,b) { return b.rate - a.rate; })

    x.domain(data.map(function(d) {
        return d.company_name;
    }));

    barSVG.append('g')
        .attr('class', 'line35')
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', y(35))
        .attr('y2', y(35))
        .transition()
        .duration(1000)
        .attr('x2', width)

    barSVG.append('g')
        .attr('class', 'axis')
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .style('opacity', 0)
        .transition()
        .duration(3000)
        .style('opacity', 1);

    barSVG.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    var bars = barSVG.selectAll('.bar')
        .data(data)

    bars
        .enter()
        .append('rect')
        .attr('id', function(d) { 
            return slugify(d.company_name) + '-path';
        })
        .attr('class', function(d) {
            if (d.rate < 0){
                return 'bar negative';
            } else {
                return 'bar positive';
            }
        })
        .attr('x', function(d) {
            return x(d.company_name);
        })
        .attr('y', function(d) {
            return y(0);
        })
        .attr('width', 2)
        .attr('height', 0)
        // // .on('mouseover', function(d){
        // //     d3.select('#_yr')
        // //         .text('Company: ' + d.company_name);
        // //     d3.select('#degree')
        // //         .text('Rate: ' + d.rate + '%');
        // // })
        .transition()
        .duration(10)
        .delay(function (d, i) {
            return i * 20;
        })
        .attr('y', function(d) {
            if (d.rate > 0){
                return y(d.rate);
            } else {
                return y(0);
            }
        })
        .attr('height', function(d) {
            return Math.abs(y(d.rate) - y(0));
        })
        .end(function() {
            // transitionTo92();
        });

    bars
        .exit()
        .transition()
        .duration(1000)
        .attr('y', function(d) {
            return y(0);
        })
        .attr('height', function(d) {
            return 0;
        })
}

var fadeBars = function (opacity) {
    d3.selectAll('.bar')
        .transition()
            .duration(300)
            .delay(function (d, i) {
                return i * 10;
            })
        .style('opacity', opacity);

}

var yearsNoTax = function () {
    fadeBars(0.5);
    highlightBars('#molina-healthcare-path, #centene-path, #wec-path');
}

var transitionTo92 = function() {
    d3.selectAll('.bar')
        .transition()
            .duration(100)
        .style('opacity', 0);
    highlightBars('#molina-healthcare-path, #centene-path, #wec-path');
}
