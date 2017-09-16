var slugify = function (string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

var type = function (d) {
	d.profit = +d.profit;
    d.rate = +d.rate;
    d.years_no_tax = +d.years_no_tax;
    d.tax_break = +d.tax_break;
    return d;
}

var amtIf35 = function(companies) {
	var total = 0;
	data = companies.map(function(d) {
		total+=d.profit*0.35;
	});
	// console.log(total);
	return(total);
}

var amtSaved = function(companies) {
	var total = 0;
	data = companies.map(function(d) {
		if(d.tax_break>0) {
			total+=type(d.tax_break);
		}
	});
	// console.log(total);
	return(total);
}

d3.csv("../csv/dv_data/interactive_data.csv", type, function(companies) {
	// console.log(companies);
	// var total35 = 0;
	var companyNames = ['All companies'];
	var companyMap = {};
	data = companies.map(function(d)
	{
		companyNames.push(d.company_name);
		companyMap[slugify(d.company_name)] = {
			'company_name': d.company_name,
			'profit': d.profit,
			'rate': d.rate,
			'industry': d.industry,
			'years_no_tax': d.years_no_tax,
			'note': d.note,
			'tax_break': d.tax_break,
			'stock_options': d.stock_options,
			'research_experiment': d.research_experiment,
			'dpad': d.dpad,
			'acc_depreciation': d.acc_depreciation,
			'deferred_taxes': d.deferred_taxes
		};
		// total35+=d.profit*0.35;
	});
	console.log(companyMap);
	populateDropdown(companyNames);

	// loadBarData(companies);
	loadInfo('3m',companyMap['3m']);
	totalTaxBreaks = amtSaved([companies[0]]);
	total35 = amtIf35(companies)/1000;
	totalTaxBreaks = amtSaved(companies)/1000;

});