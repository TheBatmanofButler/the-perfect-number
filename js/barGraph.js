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

var createSlides = function (data
                             companiesYearsNoTax,
                             companiesTop25,
                             companiesRebates) {
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
      y = barGraphSettings[1],
      xAxis = barGraphSettings[2],
      barGraph = barGraphSettings[3];

  $('#slide2').click( function (e) {
    slide2(width, x, y, data, barGraph);
  });

  $('#slide3').click( function (e) {
    slide3(width, x, y, data, companiesYearsNoTax, barGraph);
  });

  $('#slide4').click( function (e) {
    slide4(width, x, y, data, companiesTop25, barGraph);
  });
}

var initBarGraph = function (margin, width, height, data) {

  var barGraph = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('class', 'bar-graph')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleBand()
      .range([0, width, .1, 1]);

  data = data.sort(function(a,b) { return b.rate - a.rate; });

  x.domain(data.map(function(d) {
      return d.company_name;
  }));

  var y = d3.scaleLinear()
      .domain([-15,50])
      .range([height,0]);

  var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.format('d'));

  barGraph
    .append('g')
    .attr('id', 'y-axis')
    .attr('class', 'axis')

    return [x, y, xAxis, barGraph];
}

var updatePercentLine = function (barGraph, y, percent, duration, width, callback) {
  barGraph.append('g')
    .attr('class', 'percent-line')
    .append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', y(percent))
    .attr('y2', y(percent))
    .transition()
    .duration(duration)
    .attr('x2', width)
    .end(callback);
}

var updateXAxis = function (barGraph, width, y, duration) {
  barGraph.append('g')
    .attr('class', 'axis')
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .style('opacity', 0)
    .transition()
    .duration(duration)
    .style('opacity', 1);
}

var updateYAxis = function (tickValues, barGraph, y, duration) {
  var yAxis = d3.axisLeft()
      .tickValues(tickValues)
      .tickFormat( function (d) {
        return d + '%';
      })
      .tickSize(0)
      .scale(y);

  barGraph.select('#y-axis')
    .transition()
    .duration(duration)
    .call(yAxis);
}

var updateBars = function (barGraph, data, x, y, color, duration, callback) {
    var bars = barGraph.selectAll('.bar')
      .data(data, function(d) {
        return d['company_name']
      });

    bars
      .enter()
      .append('rect')
      .attr('id', function(d) { 
          return slugify(d['company_name']) + '-path';
      })
      .attr('class', 'bar')
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
      .style('fill', color)
      .attr('width', 2)
      .attr('height', function(d) {
          return Math.abs(y(d['rate']) - y(0));
      })
      .on('mouseover', function(d){
        console.log(d['company_name']);
      })
      .style('opacity', 0)
      .transition()
      .duration(duration)
      .style('opacity', 1)
      .end( function () {
        if (callback) callback();
      });

    bars
      .exit()
      .remove();
}

var highlightBars = function (data, subset, duration, color, callback) {
  d3.selectAll('.bar')
    .filter( function (d) {
      return subset.indexOf(d) > -1;
    })
    .transition()
    .duration(duration)
    .style('fill', color)
    .end( function () {
      if (callback) callback();
    });

}

var slide2 = function (width, x, y, data, barGraph) {
  updateYAxis([35], barGraph, y, 1000);
  updatePercentLine(barGraph, y, 35, 3000, width, function () {
    updateYAxis([0,35], barGraph, y, 1000);
    updateXAxis(barGraph, width, y, 1000);
    updateBars(barGraph, data, x, y, '#000', 1000);
  });
}

var slide3 = function (width, x, y, data, companiesYearsNoTax, barGraph) {
  updateYAxis([0,35], barGraph, y, 1000);
  updateXAxis(barGraph, width, y, 1000);

  var highlightBarsTimeout = function (data, companiesYearsNoTax, ii) {
    var time = (9 - ii) * 1000;
    setTimeout( function () {
      highlightBars(data, companiesYearsNoTax[ii], 1000, 'red');
    }, time); 
  }

  updateBars(barGraph, data, x, y, '#000', 1000, function () {
    for (var ii = 8; ii > 0; ii--) {
      highlightBarsTimeout(data, companiesYearsNoTax, ii);
    }
  });
}

var slide4 = function (width, x, y, data, companiesTop25, barGraph) {
  updateYAxis([0,35], barGraph, y, 1000);
  updateXAxis(barGraph, width, y, 1000);
  updateBars(barGraph, data, x, y, '#000', 1000, function () {
    highlightBars(data, companiesTop25, 1000, 'red');
  });
}

var slide5 = function (width, x, y, data, companiesTop25, barGraph) {
  updateYAxis([0,35], barGraph, y, 1000);
  updateXAxis(barGraph, width, y, 1000);
  updateBars(barGraph, data, x, y, '#000', 1000, function () {
    highlightBars(data, companiesTop25, 1000, 'red');
  });
}

// var slide3 = function (width, x, y, yAxis, data, barGraph) {

//     addYAxis(barGraph, y);

//     var bars = barGraph.selectAll('.bar')
//         .data(data, function(d) {
//           console.log(d['company_name'])
//           return d['company_name'];
//         })

//     bars
//         .enter()
//         .append('rect')
//         .attr('id', function(d) { 
//             return slugify(d.company_name) + '-path';
//         })
//         .attr('class', function(d) {
//             if (d.rate < 0){
//                 return 'bar negative';
//             } else {
//                 return 'bar positive';
//             }
//         })
//         .attr('x', function(d) {
//             return x(d.company_name);
//         })
//         .attr('y', function(d) {
//             if (d.rate > 0){
//                 return y(d.rate);
//             } else {
//                 return y(0);
//             }
//         })
//         .attr('width', 2)
//         .attr('height', function(d) {
//             return Math.abs(y(d.rate) - y(0));
//         })
//         .on('click', function(e, i){
//           var x = data.splice(i, 1);
//           console.log(x);
//           slide3(width, x, y, yAxis, data, barGraph);
//         });

// }

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
