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
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.format("d"));

var yAxis = d3.axisLeft()
    .scale(y);

var barSVG = d3.select("#chart").append("svg")
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

    var bars = barSVG.selectAll(".bar")
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
            if (d.rate > 0){
                // return y(0);
                return y(d.rate);
            } else {
                return y(0);
            }

        })
        .attr("x", function(d) {
            return x(d.company_name);
        })
        .attr("width", 2,5)
        // .attr("height", function(d) {
        //     return Math.abs(y(d.rate) - y(0));
        // })
        .attr("height", 0)
        // .attr("height", function(d) {
        //     if (d.rate > 0){
        //         return Math.abs(y(d.rate));
        //     } else {
        //         return 0;
        //     }
        // })
        .on("mouseover", function(d){
            // alert("company_name: " + d.company_name + ": " + d.rate + " rate");
            d3.select("#_yr")
                .text("Company: " + d.company_name);
            d3.select("#degree")
                .text("Rate: " + d.rate + "%");
        });


    barSVG.append("g")
        .attr("class", "line35")
        .append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", y(35))
        .attr("y2", y(35))
        .transition()
        .duration(1000)
        .attr("x2", width)

    barSVG.append("g")
        .attr("class", "axis")
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .style('opacity', 0)
        .transition()
        .duration(3000)
        .style('opacity', 1);


    d3.selectAll('.bar')
        .transition()
        .duration(3000)
        .attr("height", function(d) {
            if (d.rate > 0){
                console.log(Math.abs(y(d.rate) - y(0)))
                return Math.abs(y(d.rate) - y(0));
            } else {
                return Math.abs(y(d.rate) - y(0));
            }
        });

});


function type(d) {
    d.rate = +d.rate;
    return d;
}