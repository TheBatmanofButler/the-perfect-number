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

d3.csv("csv/dv_data/interactive_data.csv", type, function(error, data) {
    data = data.sort(function(a,b) { return b.rate - a.rate; })

    x.domain(data.map(function(d) {
        return d.company_name;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.rate;
    })).nice();

    // x.domain(data.map(function(d) { return d.company_name; }));
    // y.domain([d3.min(data, function(d) { return d.Celcius; }), d3.max(data, function(d) { return d.Celcius; })]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) {
            // console.log('hi')
            // console.log(d.rate);
            if (d.rate < 0){
                return "bar negative";
            } else {
                return "bar positive";
            }

        })
        .attr("data-yr", function(d){
            return d.company_name;
        })
        .attr("data-c", function(d){
            return d.rate;
        })
        .attr("title", function(d){
            return (d.company_name + ": " + d.rate + "%")
        })
        .attr("y", function(d) {
            // console.log(y(0))
            if (d.rate > 0){
                return y(d.rate);
            } else {
                return y(0);
            }

        })
        .attr("x", function(d) {
            // console.log(x)
            return x(d.company_name);
        })
        // .attr("width", x.rangeBand())
        .attr("width", 2,5)
        .attr("height", function(d) {
            return Math.abs(y(d.rate) - y(0));
        })
        .on("mouseover", function(d){
            // alert("company_name: " + d.company_name + ": " + d.rate + " rate");
            d3.select("#_yr")
                .text("Company: " + d.company_name);
            d3.select("#degree")
                .text("Rate: " + d.rate + "%");
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .text("% rate")
        .attr("transform", "translate(15, 40), rotate(-90)")

    svg.append("g")
        .attr("class", "X axis")
        .attr("transform", "translate(" + (margin.left - 6.5) + "," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x2", width);

    svg.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", y(35))
        .attr("y2", y(35))
        .attr("x2", width);

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(50, 250)")
        .append("text")
        .attr("id", "_yr");

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(270, 250)")
        .append("text")
        .attr("id","degree");

});


function type(d) {
    d.rate = +d.rate;
    return d;
}