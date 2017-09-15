var years = {};

var type = function (d) {
    d.rate = +d.rate;
    return d;
}


d3.csv("../csv/dv_data/interactive_data.csv", type, function(companies) {
	console.log(companies);

	var companyNames = ['All companies'];

	data = companies.map(function(d)
	{
		companyNames.push(d.company_name);
	});

	populateDropdown(companyNames);

	for (var i = 1; i < 9; i++) {
		years[i] = [2,3]
	};

	loadBarData(companies);
});