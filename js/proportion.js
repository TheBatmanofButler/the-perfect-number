/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
  // $('.arrow>img').show(1000);
}

var closeProportionGraph = function () {
  // $('.arrow>img').hide(1000);
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

var createProportionGraph = function () {

  var square = 10,
    w = 1500,
    h = 300;

  // create the svg
  var svg = d3.select('#grid').append('svg')
    .attr('id', 'gridSVG')
    .attr({
      width: w,
      height: h
    });

  // calculate number of rows and columns
  var squaresRow = Math.round(w / square);
  var squaresColumn = Math.round(h / square);

  // loop over number of columns
  d3.range(squaresColumn).forEach( function(n) {
    // create each set of rows
    var rows = svg.selectAll('rect' + ' .row-' + (n + 1))
      .data(d3.range(squaresRow))
      .enter().append('rect')
      .attr('class', 'square')
    .attr('id', function(d, i) {
      return 'r-' + n + 'c-' + i;
    })
    .attr('width', square)
    .attr('height', square)
    .attr('x', function(d, i) {
      return i * square;
    })
    .attr('y', n * square)
    .attr('fill', '#fff')
    .attr('stroke', '#FDBB30')
    .on('mouseover', function(d, i) {
      console.log('r-' + n + 'c-' + i);
    });
  });

}

var changeSquareColor = function(rowNum, columnNum, color) {
  d3.select('#' + 'r-' + rowNum + 'c-' + columnNum)
    .attr('fill', color)
}

var chart = $('#gridSVG'),
    aspect = chart.width() / chart.height(),
    container = chart.parent();

$(window).on('resize', function() {
    var targetWidth = container.width();
    chart.attr('width', targetWidth);
    chart.attr('height', Math.round(targetWidth / aspect));
}).trigger('resize');

createProportionGraph();