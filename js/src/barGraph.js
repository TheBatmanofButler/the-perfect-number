let barGraphParams = {
  barGraphWidth: null,
  barGraphHeight: null,
  x: null,
  y: null,
  yParam: null,
  data: null,
  marginTop: 50,
  marginRight: 40,
  marginBottom: 100,
  marginLeft: 80,
  axisEnding: '%',
  domainStart: null,
  domainEnd: null,
  barGraphTextX: null,
  barGraphTextValue: null
}

let slideInProgress = false;

let clearTop = function () {
  $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
}

let createSlides = function (data, companiesYearsNoTax, companiesTop25, companiesRebates, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees, companiesCompUp, companiesForeignDiff, companiesCompetitors) {

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
    if (!allRegionsDrawn || currentSlide == 1) return;

    if (slideInProgress)
      shouldFade = true;

    currentSlide = 1;
    slide1(data);
    clearTop();
    $('#slide1 div:first').addClass('active-slide-no-square');
  });

  $('#slide2').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide2(data);
    currentSlide = 2;
    clearTop();
    $('#slide2 div:first').addClass('active-slide-no-square');
  });

  $('#slide3').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide3(data, companiesYearsNoTax);
    currentSlide = 3;
    clearTop();
    $('#slide3 div:first').addClass('active-slide-no-square');
  });

  $('#slide4').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide4(data, companiesTop25);
    currentSlide = 4;
    clearTop();
    $('#slide4 div:first').addClass('active-slide-no-square');
  });

  $('#slide5').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide5(data, companiesRebates);
    currentSlide = 5;
    clearTop();
    $('#slide5 div:first').addClass('active-slide-no-square');
  });

  $('#slide6').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide6(data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees, companiesCompUp);
    currentSlide = 6;
    clearTop();
    $('#slide6 div:first').addClass('active-slide-no-square');
  });

  $('#slide7').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide7(data, companiesForeignDiff);
    currentSlide = 7;
    clearTop();
    $('#slide7 div:first').addClass('active-slide-no-square');
  });

  $('#slide8').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide8(data, companiesCompetitors);
    currentSlide = 8;
    clearTop();
    $('#slide8 div:first').addClass('active-slide-no-square');
  });

  $('#slide9').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    slide9(data);
    currentSlide = 9;
    clearTop();
    $('#slide9 div:first').addClass('active-slide-no-square');
  });

  $('.slide-explore').click( function (e) {
    if (!allRegionsDrawn) return;

    if (slideInProgress)
      shouldFade = true;

    clearTop();
    $('.slide-explore').addClass('active-slide-no-square');
    $('.typeahead').typeahead('val', '');
    openMapView(allCompanyData, 'All Companies');
  });
}

let initBarGraph = function () {

  let barGraphWidth = barGraphParams['barGraphWidth'];
  let barGraphHeight = barGraphParams['barGraphHeight'];
  let marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'];

  updateXScale();
  updateBarGraphParam('domainStart', -15);
  updateBarGraphParam('domainEnd', 50);
  updateYScale();

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

  createOpeningSlide();

  barGraph
    .append('g')
    .attr('class', 'y-axis axis')
    .style('opacity', 0);

  d3.select('.bar-graph-elements')
    .append('line')
    .attr('class', 'percent-line')
    .style('opacity', 0);

  let y = barGraphParams['y'],
      x = barGraphParams['x'];

  barGraph
    .append('text')
    .attr('class', 'company-label')
    .style('font-size', '2vw');

  let yDomain = barGraphParams['y'].domain(),
      barGraphTextY = yDomain[yDomain.length - 1];

  barGraph
    .append('text')
    .attr('class', 'bar-graph-text')
    .attr('x', barGraphWidth * 0.3)
    .attr('y', y(barGraphTextY));


  // barGraph
  //   .append('g')
  //   .append('svg')
  //   .attr('class', 'bar-graph-text-arrow')
  //   .attr('xmlns', 'http://www.w3.org/2000/svg')
  //   .attr('viewBox', '0 0 8 8')
  //   .attr('width', 17)
  //   .attr('height', 17)
  //   .style('opacity', 0)
  //   .append('path')
  //   .attr('d', 'M0 0v8l4-4-4-4z')
  //   .attr('transform', 'translate(2)')

  barGraph
    .append('g')
      .attr('class', 'x-axis axis')
      .attr('transform', 'translate(0,' + y(0) + ')')
      .append('line')
      .attr('x1', 0)
      .attr('x2', barGraphWidth)
      .style('opacity', 0);

  barGraph
    .append('g')
    .append("text")
    .attr('class', 'y-label')
    .attr("text-anchor", "middle")
    .style('font-size', '15px');

}

let getWordX = function (arr, pos) {
  let sum = 50;
  for (let i = 0; i < pos; i++) {
    sum += arr[i];
  }
  return sum;
}

let createOpeningSlide = function () {

  let quote1 = '"That\'s the number I wanted to get to. I wanted to start at 15 to get there.';
  let quote2 = 'We really had to start there because of the complexity of the numbers,'; 
  let quote3 = 'but 20 is a perfect number."';
  let quote4 = '- Donald Trump on the U.S. corporate tax rate';

  let width = 1415,
      height = 407;

  let barGraphWidth = barGraphParams['barGraphWidth'],
      barGraphHeight = barGraphParams['barGraphHeight'],
      marginTop = barGraphParams['marginTop'],
      marginRight = barGraphParams['marginRight'],
      marginBottom = barGraphParams['marginBottom'],
      marginLeft = barGraphParams['marginLeft'],
      totalWidth = barGraphWidth + marginLeft + marginRight,
      totalHeight = barGraphHeight + marginTop + marginBottom;

  let quoteChars = quote1.split('').concat(quote2.split(''))
                                   .concat(quote3.split(''))
                                   .concat(quote4.split('')),
      openingScreen = d3.select('.bar-graph')
                        .attr('width', null)
                        .attr('height', null)
                        .attr("viewBox", '0 0 1300 500')
                        .attr("preserveAspectRatio", "xMidYMid meet");

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


  updateQuoteText(45, quote1.length, quote1.length + quote2.length, quote1.length + quote2.length + quote3.length);

  openingScreen
        .append('g')
        .append('text')
        .text('by')
        .attr('class', 'pedal')
        .attr('x', 25)
        .attr('y', 260)
        .style('opacity', 0)

  openingScreen
        .append('g')
        .append('text')
        .text('Pedal')
        .attr('class', 'pedal bolden')
        .attr('x', 70)
        .attr('y', 260)
        .style('opacity', 0);

  openingScreen
        .append('g')
        .append('svg')
        .attr('class', 'pedal-link bolden')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('x', 160)
        .attr('y', 245)
        .attr('viewBox', '0 0 8 8')
        .attr('width', 15)
        .attr('height', 15)
        .style('opacity', 0)
        .append('path')
        .attr('d', 'M0 0v8h8v-2h-1v1h-6v-6h1v-1h-2zm4 0l1.5 1.5-2.5 2.5 1 1 2.5-2.5 1.5 1.5v-4h-4z')

  d3.selectAll('.pedal, .pedal-link')
    .on('click', function () {
      d3.event.stopPropagation();
      window.open('http://home.pedal.tech');
    })

  openingScreen
        .append('g')
        .append('text')
        .text('Click to advance')
        .attr('class', 'click-advance')
        .attr('x', 1043)
        .attr('y', 30)
        .style('opacity', 0)
        .style('font-style', 'italic');

  // openingScreen
  //       .append('g')
  //       .append('svg')
  //       .attr('class', 'click-advance')
  //       .attr('xmlns', 'http://www.w3.org/2000/svg')
  //       .attr('x', 1230)
  //       .attr('y', 14)
  //       .attr('viewBox', '0 0 8 8')
  //       .attr('width', 17)
  //       .attr('height', 17)
  //       .style('opacity', 0)
  //       .append('path')
  //       .attr('d', 'M0 0v8l4-4-4-4z')
  //       .attr('transform', 'translate(2)')

  d3.selectAll('.bolden')
        .on("mouseover", function () {
          d3.selectAll('.bolden')
            .style('fill', '#566C58');
        })
        .on("mouseout", function () {
          d3.selectAll('.bolden')
            .style('fill', '#000');
        })


  let timeout = setTimeout(function () {
    let i = 0;
    let totalWidth1 = 20;
    let totalWidth2 = 20;
    let totalWidth3 = 12;
    

    d3.selectAll('.quote-text')
      .transition()
      .duration(2000)
      .style('opacity', 0);
    
    d3.selectAll('.highlight')
      .transition()
      .duration(1000)
      .style('fill', '#367558')
      .style('opacity', 1)
      .transition()
      .delay(1000)
      .style('font-size', '80px')
      .attr('x', function (d, i) {
        let charWidth,
            widthMultiple;
        // console.log(browserName);
        if (getBrowserName() == "Firefox")
          widthMultiple = 4.5;
        else
          widthMultiple = 2.5;

        if (d == ' ')
          charWidth = 0.01 * barGraphWidth;
        else if (d == 'r' || d == 'c')
          charWidth = this.getComputedTextLength() * widthMultiple + 3;
        else
          charWidth = this.getComputedTextLength() * widthMultiple;

        let currentPosition;
        if (i < 3) {
          currentPosition = totalWidth1;
          totalWidth1 += charWidth;
        }
        else if (i < 10) {
          currentPosition = totalWidth2;
          totalWidth2 += charWidth;
        }
        else {
          currentPosition = totalWidth3;
          totalWidth3 += charWidth;
        }

        return currentPosition;
      })
      .attr('y', function (d,i) {

        if (i < 3)
          return 60;
        else if (i < 10)
          return 130;
        else
          return 200;

      });

    d3.selectAll('.pedal, .pedal-link')
      .transition()
      .delay(2000)
      .duration(2000)
      .style('opacity', 1)
      .end( function () {
        d3.selectAll('.click-advance')
          .transition()
          .duration(2000)
          .style('opacity', 1)
      })

  }, 50 * quoteChars.length);

  openingScreenTimeouts.push(timeout);
}

let sumTillPosition = function (arr, pos) {
  let sum = 0;
  for (let i = 0; i < pos; i++) {
    sum += arr[i];
  }
  return sum;
}

let updateQuoteText = function (duration, lineBreak1, lineBreak2, lineBreak3) {
  let barGraphWidth = barGraphParams['barGraphWidth'],
      totalWidth1 = 20,
      totalWidth2 = 20,
      totalWidth3 = 20,
      totalWidth4 = 130,
      text = d3.selectAll('.quote-text');

  text
    .style('font-size', 30)
    .style('opacity', 0)
    .text( function (d, i) {
      if (d == '|')
        d3.select(this).attr('id','cursor');
      if ((i > 7 && i < 11 )|| (i > 157 && i < 172))
        d3.select(this).attr('class','highlight');
      return d;
    })
    .attr('y', function (d, i) {
      if (i < lineBreak1) 
        return 40;
      else if (i < lineBreak2)
        return 80;
      else if (i < lineBreak3)
        return 120;
      else
        return 160;
    })
    .attr('x', function (d, i) {
      
      let charWidth;
      if (d == ' ')
        charWidth = 0.01 * barGraphWidth;
      else
        charWidth = this.getComputedTextLength();

      let currentPosition;
      if (i < lineBreak1) {
        currentPosition = totalWidth1;
        totalWidth1 += charWidth;
      }
      else if(i < lineBreak2) {
        currentPosition = totalWidth2;
        totalWidth2 += charWidth;
      }
      else if(i < lineBreak3) {
        currentPosition = totalWidth3;
        totalWidth3 += charWidth;
      }
      else {
        currentPosition = totalWidth3;
        totalWidth3 += charWidth;
      }
      
      return currentPosition;
    })
    .each( function (d,i) {
      let element = this;
      let timeout = setTimeout( function () {
        d3.select(element)
          .style('opacity', 1);
      }, i * duration);
      openingScreenTimeouts.push(timeout);
    })
}

let resizeBarGraph = function () {

  if (currentSlide == null) {
    let mapModeHeight = $('.visualization').outerHeight() 
                                         - $('.top').outerHeight() 
                                         - $('.dynamic-text').outerHeight()
                                         - $(window).outerHeight() * 0.45;
    updateBarGraphParam('tickValues', [0, 35]);
    updateBarGraphDims(mapModeHeight);

    updateXScale();
    updateYScale();

    updateYAxis(0, false);
    updateCompanyLabel(0);
    updateBarGraphYLabel(0, 'Rate');
    updateXAxis(0);

    updateBarGraphSVG(0);
    updateBars(0, 0, 0);
  }

  else if (currentSlide > 1) {
    updateBarGraphDims();

    updateXScale();
    updateYScale();

    updateBarGraphSVG(0);

    updateBarGraphText(0);
    updateCompanyLabel(0);
    console.log(888);
    updateBarGraphYLabel(0);

    if (d3.select('.percent-line').style('opacity') != 0)
      updatePercentLine(0);

    updateYAxis(0, false);
    updateXAxis(0);
    updateBars(0, 0, 0);

    if (slideInProgress) restartSlide(1000);
  }
}

let openMapView = function (data, company) {

  let mapModeHeight = $('.visualization').outerHeight() 
                                       - $('.top').outerHeight() 
                                       - $('.dynamic-text').outerHeight()
                                       - $(window).outerHeight() * 0.45;

  d3.select('.search-wrapper')
    .transition()
    .duration(1000)
    .style('visibility', 'visible')
    .style('opacity', 1);

  let chain = hideBarGraphText(1000);

  if (currentSlide == 1 && !inMapMode) {
    chain = chain.then( function () {
      return fadeStart(500, data);
    });
  }

  currentSlide = null;

  return chain
    .then( function () {
      slideInProgress = false;
      if (!inMapMode)
        return Promise.all([
          highlightAllBars('rgba(0,0,0,0.4)', 0)
        ]);
    })
    .then( function () {

      removeBarGraphClicks();
      $('.proportion-graph-viewer').css('display', 'flex');
      $('.proportion-graph-viewer').animate({'height': '45vh'}, 1000, 'linear', function () {
        let slugifiedCompanyName = slugify(company),
            companyInfo = infoBoxData[slugifiedCompanyName];
        loadInfo(companyInfo);

        initPropGraph(company);
        updatePropGraph();
      }); 

      return Promise.all([
              $('.bar-graph-elements').animate({'opacity': 1}),
              updateBarGraphParam('marginTop', 0),
              updateBarGraphParam('marginBottom', 90),
              updateBarGraphDims(mapModeHeight),

              updateXScale(),
              updateBarGraphParam('domainStart', -15),
              updateBarGraphParam('domainEnd', 50),
              updateYScale(),
              updateBarGraphSVG(1000),

              updateCompanyLabel(1000),

              updateBarGraphParam('data', data),
              updateBarGraphParam('yParam', 'rate'),
              updatePercentLine(1000),

              updateBarGraphParam('tickValues', [0, 35]),
              updateBarGraphYLabel(1000, 'Rate'),
              updateYAxis(1000),
              updateXAxis(1000),
              updateBars(0, 1000, 1000)
            ]);
    })
    .then( function () {
      if (!inMapMode) {
        return Promise.all([
          fadeOutPercentLine(1000),
          highlightBarsSplit('rate', 35, '#0FEA00', 'rgba(0,0,0,0.4)', 1000)        
        ]);
      }
    })
    .then( function () {
      inMapMode = true;
    })

}

let closeMapView = function () {
  if (currentSlide != null && inMapMode) {
    $('.proportion-graph-viewer').animate({'height': '0'}, 1000, 'linear');
    $('.proportion-graph-viewer').hide(500);
    addBarGraphClicks();

    return updateStoryText(1000, '');
  }

}

let fadeOutPercentLine = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.select('.percent-line')
      .transition()
      .duration(duration)
      .style('opacity', 0)
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
      .ease(d3.easeLinear)
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
      .ease(d3.easeLinear)
      .style('fill', color)
      .end(resolve);
  });
}

let fadeAll = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.selectAll('.bar-graph-elements, .dynamic-text')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(resolve);
  });
}

let showAll = function (duration) {
  return new Promise( function (resolve, reject) {
    d3.selectAll('.bar-graph-elements, .dynamic-text')
      .transition()
      .duration(duration)
      .style('opacity', 1)
      .end(resolve);
  });
}

let fadeOpeningScreen = function(duration) {
  return new Promise( function (resolve, reject) {

    for (let ii in openingScreenTimeouts) {
      let timeout = openingScreenTimeouts[ii];
      clearTimeout(timeout);
      timeout = 0;
    }
    openingScreenTimeouts = [];

    d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, .click-advance')
      .transition()
      .duration(duration)
      .style('opacity', 0)
      .end(function () {
        let barGraphWidth = barGraphParams['barGraphWidth'],
            barGraphHeight = barGraphParams['barGraphHeight'],
            marginTop = barGraphParams['marginTop'],
            marginRight = barGraphParams['marginRight'],
            marginBottom = barGraphParams['marginBottom'],
            marginLeft = barGraphParams['marginLeft'],
            totalWidth = barGraphWidth + marginLeft + marginRight,
            totalHeight = barGraphHeight + marginTop + marginBottom;

        d3.select('.bar-graph')
          .attr('width', totalWidth)
          .attr('height', totalHeight)
          .attr("viewBox", null)
          .attr("preserveAspectRatio", null);

        d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, click-advance')
          .style('visibility', 'hidden')
          .style('position', 'absolute');

        resolve();
      });
  });
}

let showOpeningScreen = function(data) {
  slideInProgress = false;
  let barGraphWidth = barGraphParams['barGraphWidth'],
            barGraphHeight = barGraphParams['barGraphHeight'],
            marginTop = barGraphParams['marginTop'],
            marginRight = barGraphParams['marginRight'],
            marginBottom = barGraphParams['marginBottom'],
            marginLeft = barGraphParams['marginLeft'],
            totalWidth = barGraphWidth + marginLeft + marginRight,
            totalHeight = barGraphHeight + marginTop + marginBottom,
            mapModeHeight = $('.graph-viewers').height();

  return new Promise( function (resolve, reject) {

    fadeAll(500)
    .then( function () {
      return Promise.all([
        updateStoryText(0, ''),
        appendStoryText(0, ''),

        updateBarGraphParam('marginBottom', 100),
        updateBarGraphParam('marginTop', 50),
        updateBarGraphDims(mapModeHeight),

        updateBarGraphParam('axisEnding', '%'),
        updateXScale(),
        updateBarGraphParam('domainStart', -15),
        updateBarGraphParam('domainEnd', 50),
        updateYScale(),
        updateBarGraphSVG(0),

        updateBarGraphParam('barGraphTextValue', null),
        updateBarGraphParam('barGraphTextX', 0.3),
        hideBarGraphText(0),
        updateCompanyLabel(0),

        updateBarGraphParam('data', data),
        updateBarGraphParam('yParam', 'rate'),

        updateBarGraphParam('tickValues', [0,35]),
        updateBarGraphYLabel(0),
        updateYAxis(0),
        updateXAxis(0),
        updatePercentLine(0),
        updateBars(0, 0, 0)
      ]);
    })
    .then( function () {

      let barGraphWidth = barGraphParams['barGraphWidth'],
          totalWidth1 = 20;
          totalWidth2 = 20;
          totalWidth3 = 12;


      d3.select('.bar-graph')
        .attr('width', null)
        .attr('height', null)
        .attr("viewBox", '0 0 1400 500')
        .attr("preserveAspectRatio", "xMidYMid meet");

      d3.selectAll('.highlight')
        .style('font-size', '80px')
        .attr('x', function (d, i) {
          let charWidth;
          if (d == ' ')
            charWidth = 0.01 * barGraphWidth;
          else
            charWidth = this.getComputedTextLength();

          let currentPosition;
          if (i < 3) {
            currentPosition = totalWidth1;
            totalWidth1 += charWidth;
          }
          else if (i < 10) {
            currentPosition = totalWidth2;
            totalWidth2 += charWidth;
          }
          else {
            currentPosition = totalWidth3;
            totalWidth3 += charWidth;
          }

          return currentPosition;
        })
        .attr('y', function (d,i) {

          if (i < 3)
            return 60;
          else if (i < 10)
            return 130;
          else
            return 200;
        })
        .transition()
        .duration(1000)
        .style('fill', '#367558')
        .style('opacity', 1)

    d3.selectAll('.pedal, .pedal-link, .click-advance')
        .transition()
        .duration(1000)
        .style('opacity', 1);

    d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, .click-advance')
      .style('visibility', null)
      .style('position', null);

    });
  });
}

let fadeStart = function (duration, data, dynamicText, yStart = -15, yEnd = 50, tickValues = [0,35]) {
  let isOpeningScreen = d3.select('.bar-graph').attr('viewBox') != null;

  return new Promise( function (resolve, reject) {

    Promise.resolve()
      .then( function () {
        if (shouldFade)
          return fadeAll(duration);
      })
      .then( function () {
        if (isOpeningScreen) {
          return Promise.all([
            fadeAll(duration),
            fadeOpeningScreen(duration)
          ]);
        }
      })
      .then( function () {
        return highlightAllBars('rgba(0,0,0,0.4)', duration);
      })
      .then( function () {
        let mapModeHeight = $('.graph-viewers').height(),
            barGraphWidth = barGraphParams['barGraphWidth'];

        closeMapView();

        return Promise.all([
          updateStoryText(duration, ''),
          appendStoryText(duration, dynamicText),

          updateBarGraphParam('marginBottom', 100),
          updateBarGraphParam('marginTop', 50),
          updateBarGraphDims(mapModeHeight),

          updateBarGraphParam('axisEnding', '%'),
          updateXScale(),
          updateBarGraphParam('domainStart', yStart),
          updateBarGraphParam('domainEnd', yEnd),
          updateYScale(),
          updateBarGraphSVG(duration),

          updateBarGraphParam('barGraphTextValue', null),
          updateBarGraphParam('barGraphTextX', 0.3),
          hideBarGraphText(duration),
          updateCompanyLabel(duration, ''),

          updateBarGraphParam('data', data),
          updateBarGraphParam('yParam', 'rate'),

          updateBarGraphParam('tickValues', tickValues),
          updateBarGraphYLabel(duration),
          updateYAxis(duration),
          updateXAxis(duration),
          updatePercentLine(duration),
          updateBars(0, duration, duration)
        ]);
      })
      .then( function () {
        d3.select('.percent-line')
          .moveToFront();
        console.log(shouldFade);
        if (shouldFade || isOpeningScreen && (currentSlide != 1)) {
          shouldFade = false;
          return showAll(duration);
        }
      })
      .then(resolve);
  });
}
