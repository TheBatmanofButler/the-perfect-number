let barGraphParams = {
  barGraphWidth: null,
  barGraphHeight: null,
  x: null,
  y: null,
  yParam: null,
  data: null,
  marginTop: 50,
  marginRight: 80,
  marginBottom: 200,
  marginLeft: 80
}

let slideInProgress = false;

let clearTop = function () {
  $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
  $('.slide-explore').css('color', '#000');
  $('.slide-explore').hover( function (e) {
    $(this).css('color', e.type === 'mouseenter' ? '#fff' : '#000');
  });
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
    if (slideInProgress || !allRegionsDrawn) return;
    slide1(barGraphWidth, barGraphHeight);
    currentSlide = 1;
    clearTop();
    $('#slide1 div:first').addClass('active-slide-no-square');
  });

  $('#slide2').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide2(data);
    currentSlide = 2;
    clearTop();
    $('#slide2 div:first').addClass('active-slide-no-square');
  });

  $('#slide3').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide3(data, companiesYearsNoTax);
    currentSlide = 3;
    $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
    $('#slide3 div:first').addClass('active-slide-no-square');
  });

  $('#slide4').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide4(data, companiesTop25);
    currentSlide = 4;
    clearTop();
    $('#slide4 div:first').addClass('active-slide-no-square');
  });

  $('#slide5').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide5(data, companiesRebates);
    currentSlide = 5;
    clearTop();
    $('#slide5 div:first').addClass('active-slide-no-square');
  });

  $('#slide6').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide6(data, companiesIPS, companiesTop3EmpChanges, companiesLostEmployees, companiesCompUp);
    currentSlide = 6;
    clearTop();
    $('#slide6 div:first').addClass('active-slide-no-square');
  });

  $('#slide7').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide7(data, companiesForeignDiff);
    currentSlide = 7;
    clearTop();
    $('#slide7 div:first').addClass('active-slide-no-square');
  });

  $('#slide8').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide8(data, companiesCompetitors);
    currentSlide = 8;
    clearTop();
    $('#slide8 div:first').addClass('active-slide-no-square');
  });

  $('#slide9').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    slide9(data);
    currentSlide = 9;
    clearTop();
    $('#slide9 div:first').addClass('active-slide-no-square');
  });

  $('.slide-explore').click( function (e) {
    if (slideInProgress || !allRegionsDrawn) return;
    clearTop();
    $('.typeahead').typeahead('val', '');
    $(this).css('color', '#fff');
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
    .attr('x', 5)
    .attr('y', y(-20))
    .style('font-size', 30);

  let yDomain = barGraphParams['y'].domain(),
      barGraphTextY = yDomain[yDomain.length - 1];

  barGraph
    .append('text')
    .attr('class', 'bar-graph-text')
    .attr('x', barGraphWidth / 2)
    .attr('y', y(barGraphTextY))
    .style('font-size', '30px');

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

  let quote1 = '"That\'s the number I wanted to get to. I wanted to start at 15 to get there.';
  let quote2 = 'We really had to start there because of the complexity of the numbers,'; 
  let quote3 = 'but 20 is a perfect number."';
  let quote4 = '- Donald Trump on US Corporate Tax|';
  console.log(quote1.length)
  console.log(quote2.length)
  console.log(quote3.length)
  console.log(quote4.length)
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
                        .attr("viewBox", "0 0 " + totalWidth + " " + totalHeight)
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


  updateQuoteText(50, quote1.length, quote1.length + quote2.length, quote1.length + quote2.length + quote3.length);

  openingScreen
        .append('g')
        .append('text')
        .text('by')
        .attr('class', 'pedal')
        .attr('x', 20)
        .attr('y', 260)
        .style('opacity', 0)
        
  openingScreen
        .append('g')
        .append('text')
        .text('Pedal')
        .attr('class', 'pedal bolden')
        .attr('x', 55)
        .attr('y', 260)
        .style('opacity', 0)

  openingScreen
        .append('g')
        .append('svg')
        .attr('class', 'pedal-link bolden')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('x', 130)
        .attr('y', 245)
        .attr('viewBox', '0 0 8 8')
        .attr('width', 15)
        .attr('height', 15)
        .style('opacity', 0)
        .append('path')
        .attr('d', 'M0 0v8h8v-2h-1v1h-6v-6h1v-1h-2zm4 0l1.5 1.5-2.5 2.5 1 1 2.5-2.5 1.5 1.5v-4h-4z')

  d3.selectAll('.bolden')
        .on("mouseover", function () {
          d3.selectAll('.bolden')
            .style('fill', 'red');
        })
        .on("mouseout", function () {
          d3.selectAll('.bolden')
            .style('fill', 'black');
        })


  let timeout = setTimeout(function () {
    let i = 0;
    let totalWidth1 = 20;
    let totalWidth2 = 20;
    let totalWidth3 = 13;
    

    d3.selectAll('.quote-text')
      .transition()
      .duration(4000)
      .style('opacity', 0);
    
    d3.selectAll('.highlight')
      .transition()
      .duration(1000)
      .style('fill', 'red')
      .style('opacity', 1)
      .transition()
      .delay(1000)
      .style('font-size', '80px')
      .attr('x', function (d, i) {
        let charWidth;
        if (d == ' ')
          charWidth = 0.01 * barGraphWidth;
        else
          charWidth = this.getComputedTextLength() * 2.5;

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
    // while(i < 10) {
    //   d3.select('#cursor')
    //     .transition()
    //     .style('opacity', 0)
    //     .on('end', function() {
    //       console.log(i);
    //       i += 1;
    //       // d3.select('#cursor')
    //       // .transition()
    //       // .style('opacity', 1)
    //       // .on('end', function() {
    //       //   i += 1;
    //       // })
    //     })
    // }
    d3.selectAll('.pedal, .pedal-link')
      .transition()
      .delay(3000)
      .duration(3000)
      .style('opacity', 1);
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

  if (currentSlide > 1) {
    updateBarGraphParam('tickValues', []);
    updateBarGraphDims();

    updateXScale();
    updateYScale(-15, 50);
    updateBarGraphSVG(0);

    updateBarGraphText(null, 0);
    updateCompanyLabel(0);

    updatePercentLine(0);
    updateYAxis(0);
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

  let chain = Promise.resolve();

  if (currentSlide == 1 && !inMapMode) {
    currentSlide = null;
    chain = chain.then( function () {
      return fadeStart(500, allCompanyData);
    });
  }

  return chain
    .then( function () {
      slideInProgress = false;
      if (!inMapMode)
        return highlightAllBars('#000', 0);
    })
    .then( function () {

      // updateStoryText(500, '');
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
              updateBarGraphParam('marginBottom', 60),
              updateBarGraphDims(mapModeHeight),

              updateXScale(),
              updateYScale(-15, 50),
              updateBarGraphSVG(1000),

              updateBarGraphText(null, 1000),
              updateCompanyLabel(1000),

              updateBarGraphParam('data', data),
              updateBarGraphParam('yParam', 'rate'),
              updatePercentLine(1000),

              updateBarGraphParam('tickValues', [0, 35]),
              updateYAxis(1000, true),
              updateXAxis(1000, true),
              updateBars(0, 1000, 1000)
            ]);
    })
    .then( function () {
      if (!inMapMode) {
        return Promise.all([
          fadeOutPercentLine(1000),
          highlightBarsSplit('rate', 35, 'red', 'green', 1000)        
        ]);
      }
    })
    .then( function () {
      inMapMode = true;
    })

}

let closeMapView = function () {
  $('.proportion-graph-viewer').animate({'height': '0'}, 1000, 'linear');
  $('.proportion-graph-viewer').hide(500);
  updateStoryText(1000, '');
  addBarGraphClicks();

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
    // showAll(1000);

    for (let ii in openingScreenTimeouts) {
      let timeout = openingScreenTimeouts[ii];
      clearTimeout(timeout);
      timeout = 0;
    }
    openingScreenTimeouts = [];

    showAll(1000);

    d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link')
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
          .attr("preserveAspectRatio", null)

        resolve();
      });
  });
}

let showOpeningScreen = function(duration) {
  slideInProgress = false;
  let barGraphWidth = barGraphParams['barGraphWidth'],
            barGraphHeight = barGraphParams['barGraphHeight'],
            marginTop = barGraphParams['marginTop'],
            marginRight = barGraphParams['marginRight'],
            marginBottom = barGraphParams['marginBottom'],
            marginLeft = barGraphParams['marginLeft'],
            totalWidth = barGraphWidth + marginLeft + marginRight,
            totalHeight = barGraphHeight + marginTop + marginBottom;
  return new Promise( function (resolve, reject) {
    fadeAll(500)
    .then( function () {

      let barGraphWidth = barGraphParams['barGraphWidth'],
          totalWidth1 = 20;
          totalWidth2 = 20;
          totalWidth3 = 13;


      d3.select('.bar-graph')
        .attr('width', null)
        .attr('height', null)
        .attr("viewBox", "0 0 " + totalWidth + " " + totalHeight)
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
        .style('fill', 'red')
        .style('opacity', 1)

    d3.selectAll('.pedal, .pedal-link')
        .transition()
        .duration(1000)
        .style('opacity', 1);

    });
  });
}

let fadeStart = function (duration, data, dynamicText, yStart = -15, yEnd = 50, tickValues = [0,35]) {

  return new Promise( function (resolve, reject) {
    Promise.resolve()
      .then( function () {
        updateStoryText(duration, '');
        if (shouldFade)
          return fadeAll(duration);
      })
      .then( function () {
        let isOpeningScreen = d3.select('.bar-graph').attr('viewBox') != null;
        if (isOpeningScreen)
          return fadeOpeningScreen(duration);
      })
      .then( function () {
        return highlightAllBars('#000', 0);
      })
      .then( function () {
        let mapModeHeight = $('.graph-viewers').height();

        return Promise.all([
          appendStoryText(duration, dynamicText),
          closeMapView(),
          updateBarGraphParam('marginBottom', 200),
          updateBarGraphDims(mapModeHeight),

          updateXScale(),
          updateYScale(yStart, yEnd),
          updateBarGraphSVG(duration),

          updateBarGraphText(null, duration),
          updateCompanyLabel(duration),

          updateBarGraphParam('data', data),
          updateBarGraphParam('yParam', 'rate'),

          updateBarGraphParam('tickValues', tickValues),
          updateYAxis(duration),
          updateXAxis(duration),
          updatePercentLine(duration),
          updateBars(0, duration, duration)
        ]);
      })
      .then( function () {
        d3.select('.percent-line')
          .moveToFront();

        if (shouldFade) {
          shouldFade = false;
          return showAll(duration);
        }
      })
      .then(resolve);
  });
}
