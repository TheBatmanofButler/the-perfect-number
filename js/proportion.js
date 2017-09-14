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

  var gridDiv = document.getElementById("grid");
  
  function redraw() {
    d3.select("svg").remove();
    var svg = d3.select(gridDiv).append("svg");
    var w = gridDiv.clientWidth;
    var h = gridDiv.clientHeight;
    console.log("w: "+ w);
    console.log("h: "+ h);
    var noOfSquares = 1333;
    
    svg
      .attr('id', 'gridSVG')
      .attr({
        width: w,
        height: h
      });

    var square = Math.floor(Math.sqrt((w*h)/noOfSquares))-1;
    // calculate number of rows and columns
    var squaresRow = Math.floor(w / square);
    var squaresColumn = Math.floor(h / square);
    console.log('row: ' + squaresRow);
    console.log('column: ' + squaresColumn);
    console.log(squaresRow*squaresColumn-noOfSquares);

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
  redraw();
  window.addEventListener("resize", redraw);

}

var changeSquareColor = function(rowNum, columnNum, color) {
  d3.select('#' + 'r-' + rowNum + 'c-' + columnNum)
    .attr('fill', color)
}

var changeAreaColor = function() {
  for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
      changeSquareColor(i,j,'black')
    };
  };
}

createProportionGraph();