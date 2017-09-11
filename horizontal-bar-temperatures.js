var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30
    },
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// var y = d3.scale.linear()
//     .range([height, 0]);

// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .2);

// var xAxisScale = d3.scale.linear()
//     .domain([1880, 2015])
//     .range([ 0, width]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    // .scale(xAxisScale)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("Land-Ocean-TempIndex-YR.csv", type, function(error, data) {
    x.domain(data.map(function(d) {
        // console.log(d.Year);
        return d.Year;
    }));
    y.domain(d3.extent(data, function(d) {
        // console.log(d.Celsius);
        return d.Celsius;
    })).nice();

    // console.log(data);


    svg.selectAll(".bar")
        .data(data.sort(function(a,b) { return a.Celsius - b.Celsius; }))
        .enter().append("rect")
        .attr("class", function(d) {

            if (d.Celsius < 0){
                return "bar negative";
            } else {
                return "bar positive";
            }

        })
        .attr("data-yr", function(d){
            return d.Year;
        })
        .attr("data-c", function(d){
            return d.Celsius;
        })
        .attr("title", function(d){
            return (d.Year + ": " + d.Celsius + " °C")
        })
        .attr("y", function(d) {
            console.log(y(0))
            if (d.Celsius > 0){
                return y(d.Celsius);
            } else {
                return y(0);
            }

        })
        .attr("x", function(d) {
            // console.log(x)
            return x(d.Year);
        })
        .attr("width", x.rangeBand())
        .attr("height", function(d) {
            return Math.abs(y(d.Celsius) - y(0));
        })
        .on("mouseover", function(d){
            // alert("Year: " + d.Year + ": " + d.Celsius + " Celsius");
            d3.select("#_yr")
                .text("Year: " + d.Year);
            d3.select("#degree")
                .text(d.Celsius + "°C");
        });

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .append("text")
    //     .text("°Celsius")
    //     .attr("transform", "translate(15, 40), rotate(-90)")

    // svg.append("g")
    //     .attr("class", "X axis")
    //     .attr("transform", "translate(" + (margin.left - 6.5) + "," + height + ")")
    //     .call(xAxis);

    svg.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x2", width);

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(50, 5)")
        .append("text")
        .attr("id", "_yr");

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(110, 5)")
        .append("text")
        .attr("id","degree");

});


function type(d) {
    d.Celsius = +d.Celsius;
    return d;
}