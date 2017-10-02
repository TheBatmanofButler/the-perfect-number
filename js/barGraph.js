let barGraphParams = {
  barGraphWidth: null,
  barGraphHeight: null,
  x: null,
  y: null,
  yParam: null,
  data: null,
  marginTop: 50,
  marginRight: 80,
  marginBottom: 100,
  marginLeft: 80
}

let slideInProgress = false;

let createSlides = function (data, companiesYearsNoTax, companiesTop25, companiesRebates, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees, companiesForeignDiff, companiesCompetitors) {

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
  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'];

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

  let barGraphSVG = d3.select('.bar-graph')

  let openingScreen = barGraphSVG
                          .append('g')
                          .attr('class', 'opening-screen')
                          .style('opacity', 1);

  createOpeningSlide();


    // openingScreen
    //   .append('text')
    //   .attr('class', 'intro-text')
    //   .attr('x', 20)
    //   .attr('y', barGraphHeight * 0.7)
    //   .style('font-size', '10px')
    //   .text('by')

    // openingScreen
    //   .append('text')
    //   .attr('class', 'pedal')
    //   .attr('x', 35)
    //   .attr('y', barGraphHeight * 0.7)
    //   .style('font-size', '20px')
    //   .text('Pedal');

    // openingScreen
    //   .append('text')
    //   .attr('class', 'intro-text')
    //   .attr('x', 20)
    //   .attr('y', barGraphHeight * 0.5)
    //   .style('font-size', '40px')
    //   .text('Corporate Tax Reality');

    // openingScreen
    //   .append('text')
    //   .attr('class', 'intro-text')
    //   .attr('x', 20)
    //   .attr('y', barGraphHeight * 0.5 + 40)
    //   .style('font-size', '25px')
    //   .text('Visualizing the Federal Tax Rates for 258 Fortune 500 Companies');

  barGraph
    .append('g')
    .attr('class', 'y-axis axis')
    .style('opacity', 0);

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

let getWordX = function (arr, pos) {
  let sum = 50;
  for (let i = 0; i < pos; i++) {
    sum += arr[i];
  }
  return sum;
}

let createOpeningSlide = function () {

  let quote1 = 'America is one of the highest-taxed nations in the world.';
  let quote2 = 'America is one of the highest-taxed nations in the world.|';

  let quoteChars = quote1.split('').concat(quote2.split('')),
      wordWidths = [],
      openingScreen = d3.select('.opening-screen');


  let chars = openingScreen
                .selectAll('.char')
                .data(quoteChars, function(d) {
                  return d;
                })
                .enter()
                .append('g');

  let text = chars
              .append('text')
              .attr('class', 'quote-text');


  updateQuoteText(50, quote1.length);

  // setTimeout(function () {
  //   let i = 0;
  //   let totalWidth = 450;
  //   let barGraphWidth = barGraphParams['barGraphWidth'];
  //   console.log(i);
  //   d3.selectAll('.quote-text')
  //     .transition()
  //     .duration(4000)
  //     .style('opacity', 0);
    
  //   d3.selectAll('.highlight')
  //     .transition()
  //     .duration(1000)
  //     .style('fill', 'red')
  //     .style('opacity', 1)
  //     .transition()
  //     .delay(1000)
  //     .attr('x', function (d, i) {
  //       let charWidth;
  //       if (d == ' ')
  //         charWidth = 0.01 * barGraphWidth;
  //       else
  //         charWidth = this.getComputedTextLength();

  //       let currentPosition = totalWidth;
  //       totalWidth += charWidth;

  //       return currentPosition;
  //     })
  //     .attr('y', 150);
  //   // while(i < 10) {
  //   //   d3.select('#cursor')
  //   //     .transition()
  //   //     .style('opacity', 0)
  //   //     .on('end', function() {
  //   //       console.log(i);
  //   //       i += 1;
  //   //       // d3.select('#cursor')
  //   //       // .transition()
  //   //       // .style('opacity', 1)
  //   //       // .on('end', function() {
  //   //       //   i += 1;
  //   //       // })
  //   //     })
  //   // }
  //   chars.append('text')
  //        .text('by Pedal')
  //        .attr('class', 'pedal')
  //        .attr('x', barGraphWidth * 0.5)
  //        .attr('y', 190)
  //        .style('opacity', 0)
  //        .transition()
  //        .delay(3500)
  //        .duration(3000)
  //        .style('opacity', 0.4);
  // }, 50 * quoteChars.length);
}

let sumTillPosition = function (arr, pos) {
  let sum = 0;
  for (let i = 0; i < pos; i++) {
    sum += arr[i];
  }
  return sum;
}

let updateQuoteText = function (duration, lineBreak) {
  let barGraphWidth = barGraphParams['barGraphWidth'],
      totalWidth1 = 20,
      totalWidth2 = 100,
      text = d3.selectAll('.quote-text');

  text
    .style('font-size', 0.04 * barGraphWidth)
    .style('opacity', 0)
    .text( function (d, i) {
      if (d == '|')
        d3.select(this).attr('id','cursor');
      if (i > -1 && i < 7 || i > 20 && i < 35)
        d3.select(this).attr('class','highlight');
      return d;
    })
    .attr('y', function (d, i) {
      if (i < lineBreak) 
        return 40;
      else
        return 100;
    })
    .attr('x', function (d, i) {
      
      let charWidth;
      if (d == ' ')
        charWidth = 0.01 * barGraphWidth;
      else
        charWidth = this.getBBox().width;
        // charWidth = this.getComputedTextLength();

      let currentPosition;
      console.log(charWidth);
      if (i < lineBreak) {
        currentPosition = totalWidth1;
        totalWidth1 += charWidth;
      }
      else {
        currentPosition = totalWidth2;
        totalWidth2 += charWidth;
      }
      
      return currentPosition;
    })
    .each( function (d,i) {
      let element = this;
      setTimeout( function () {
        d3.select(element)
          .style('opacity', 1);
      }, i * duration);
    })
}

let resizeBarGraph = function () {

  if (currentSlide == 1) return;

  updateBarGraphDims();

  updateXScale();
  updateYScale(-15, 50);
  updateBarGraphSVG(1000);

  updateBarGraphText(null, 1000);
  updateCompanyLabel(1000);
  updateQuoteText();

  updatePercentLine('35', 1000);
  updateYAxis([-15, 35, 50], 1000);
  updateXAxis(1000);
  updateBars(0, 1000, 1000);

  if (slideInProgress) restartSlide(1000);
}

let openMapView = function (data) {

  $('.proportion-graph-viewer').show(1000);
  $('.proportion-graph-viewer').animate({'height': '45vh'}, 1000, 'linear', function () {
    initPropGraph('All Companies');
    updatePropGraph();
  });
  
  let mapModeHeight = $('.visualization').outerHeight() 
                                       - $('.top').outerHeight() 
                                       - $('.dynamic-text').outerHeight()
                                       - $(window).outerHeight() * 0.45;

  return new Promise( function (resolve, reject) {
    highlightAllBars('#000', 0)
    .then( function () {
      slideInProgress = false;

      Promise.all([
        updateBarGraphParam('marginBottom', 40),
        updateBarGraphDims(mapModeHeight),

        updateXScale(),
        updateYScale(-15, 50),
        updateBarGraphSVG(1000),

        updateBarGraphText(null, 1000),
        updateCompanyLabel(1000),

        updateBarGraphParam('data', data),
        updateBarGraphParam('yParam', 'rate'),
        updatePercentLine('35', 1000),

        updateBarGraphParam('tickValues', [-15, 35, 50]),
        updateYAxis(1000),
        updateXAxis(1000),
        updateBars(0, 0, 1000)
      ])
    })
    .then(resolve);
  });

}

let closeMapView = function () {
  $('.proportion-graph-viewer').animate({'height': '0'}, 1000, 'linear');
  $('.proportion-graph-viewer').hide(500);
}


let addPercentLine = function (y, percent, duration, barGraphWidth) {
  d3.select('.bar-graph-elements')
    .append('line')
    .attr('class', function () {
      return 'percent-line percent' + percent;
    })
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
    // showAll(500);
    d3.select('.opening-screen')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

let showOpeningScreen = function(duration) {
  return new Promise( function (resolve, reject) {
    fadeAll(500);
    d3.select('.opening-screen')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .end(resolve);
  });
}

let fadeStart = function (duration, data) {

  return new Promise( function (resolve, reject) {
    Promise.resolve()
      .then( function () {
        if (shouldFade)
          return fadeAll(duration);
      })
      .then( function () {
        return highlightAllBars('#000', 0);
      })
      .then( function () {
        mapModeHeight = $('.graph-viewers').height();
        closeMapView();
        return Promise.all([
          updateBarGraphParam('marginBottom', 100),
          updateBarGraphDims(mapModeHeight),

          updateXScale(),
          updateYScale(-15, 50),
          updateBarGraphSVG(1000),

          updateBarGraphText(null, 1000),
          updateCompanyLabel(1000),

          updateBarGraphParam('data', data),
          updateBarGraphParam('yParam', 'rate'),
          updatePercentLine('35', 1000),

          updateBarGraphParam('tickValues', [0,35]),
          updateYAxis(1000),
          updateXAxis(1000),
          updateBars(0, 1000, 1000)
        ]);
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
