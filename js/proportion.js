/**
 * proportion.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: API for proportion graph
 *
 */
var squaresRow=0;
var squaresColumn=0;

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
  // $('.arrow>img').show(1000);
}

var closeProportionGraph = function () {
  // $('.arrow>img').hicde(1000);
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

var createProportionGraph = function (noOfSquares) {

  var gridDiv = document.getElementById("grid");
  
  function redraw() {
    d3.select("svg").remove();
    var svg = d3.select(gridDiv).append("svg");
    var w = gridDiv.clientWidth;
    var h = gridDiv.clientHeight;
    // var noOfSquares = 1500;
    
    svg
      .attr('id', 'gridSVG')
      .attr({
        width: w,
        height: h
      });

    var square = Math.floor(Math.sqrt((w*h)/noOfSquares));
    // calculate number of rows and columns
    squaresColumn = Math.floor(w / square);
    squaresRow = Math.floor(h / square);
    while(squaresColumn*squaresRow<noOfSquares) {
      square-=1;
      squaresColumn = Math.floor(w / square);
      squaresRow = Math.floor(h / square);
    }
    // loop over number of columns
    d3.range(squaresRow).forEach( function(n) {
      // create each set of rows
      var columns = svg.selectAll('rect' + ' .column-' + (n + 1))
        .data(function(d,i) {
          // return n==squaresColumn-1? d3.range(squaresRow-squaresExtra): d3.range(squaresRow);
          return d3.range(squaresColumn);
        })
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
        })
        .style('opacity',0)
        .transition()
          .duration(2000)
          .style('opacity', 1)
    });
  }
  redraw();
  window.addEventListener("resize", redraw);

}

var changeSquareColor = function(rowNum, columnNum, color, opacity) {
  d3.select('#' + 'r-' + rowNum + 'c-' + columnNum)
    .attr('fill', color)
        .transition()
          .duration(2000)
          .style('opacity', opacity)
}

var changeAreaColor = function(rowNum, columnNum, noOfSquares, color, opacity) {
  squaresColored = 0;
  i=rowNum;
  j=columnNum;
  while(squaresColored<noOfSquares) {
    if(i==squaresRow) {
      j+=1;
      i=0;
    }
    changeSquareColor(i,j,color,opacity);
    squaresColored+=1;
    i+=1;
  };
}

createProportionGraph(1500);