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

var typeCastInteractive = function (d) {
	d['profit'] = +d['profit'];
  d['rate'] = +d['rate'];
  d['years_no_tax'] = +d['years_no_tax'];
  d['tax_break'] = +d['tax_break'];
  return d;
}

var typeCastComparison = function (d) {
  d['money'] = +d['money'];
  return d;
}

var tax35percent = function(companies) {
	var total = 0;
	data = companies.map(function(d) {
		total += d.profit * 0.35;
	});
	return total;
}

var amtSaved = function(companies) {
	var total = 0;
	data = companies.map(function(d) {
		if(d.tax_break > 0) {
			total += d['tax_break'];
		}
	});
	return total;
}

d3.csv("../csv/dv_data/interactive_data.csv", typeCastInteractive, function(companies) {
  var companyNames = ['All companies'];
	companyMap = {};
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
	});

  var companyNames = ['All companies'],
      companiesIPS = [],
      companiesYearsNoTax = {
                          '8': [],
                          '7': [],
                          '6': [],
                          '5': [],
                          '4': [],
                          '3': [],
                          '2': [],
                          '1': []
                        },
      companiesTop25 = [],
      companiesRebates = {
                          'stockOptions': [],
                          'researchExperiment': [],
                          'dpad': [],
                          'accDepreciation': [],
                          'deferredTaxes': []
                        },
      companies92 = [],
      companiesTop3EmpChanges = {
                              '1': [],
                              '2': [],
                              '3': []
                            },
      companiesLostEmployees = [],
      companiesForeignDiff = [],
      companiesCompetitors = {
                              '1': [],
                              '2': [],
                              '3': [],
                              '4': [],
                              '5': []
                            };

  companies.map(function (d) {
    companyNames.push(d['company_name']);

    if (d['ceo_comp_amt'] != '') {
      companiesIPS.push(d);
    }

    var yearsNoTax = d['years_no_tax'];
    if (d['years_no_tax'] != '0') {
      companiesYearsNoTax[yearsNoTax].push(d);
    }

    if (d['top25'] == 'True') {
      companiesTop25.push(d);
    }

    if (d['stock_options'] == 'True') {
      companiesRebates['stockOptions'].push(d);
    }

    if (d['research_experiment'] == 'True') {
      companiesRebates['researchExperiment'].push(d);
    }

    if (d['dpad'] == 'True') {
      companiesRebates['dpad'].push(d);
    }

    if (d['acc_depreciation'] == 'True') {
      companiesRebates['accDepreciation'].push(d);
    }

    if (d['deferred_taxes'] == 'True') {
      companiesRebates['deferredTaxes'].push(d);
    }

    var empChangeRank = d['top3_emp_changes'];
    if (d['top3_emp_changes'] != '0') {
      companiesTop3EmpChanges[empChangeRank].push(d);
    }

    if (d['adjusted_emp_change'] < 0) {
      companiesLostEmployees.push(d);
    }

    if (d['us_foreign_diff'] != '') {
      companiesForeignDiff.push(d);
    }

    var competitor = d['competitor'];
    if (competitor != '0') {
      companiesCompetitors[competitor].push(d);
    }

  });

	// populateDropdown(companyNames);
  createSlides(companies,
    companiesYearsNoTax,
    companiesTop25,
    companiesRebates,
    companiesIPS,
    companiesTop3EmpChanges,
    companiesLostEmployees,
    companiesForeignDiff,
    companiesCompetitors);

	// loadBarData(companies);
	total35 = Math.floor(tax35percent(companies)/1000);
	totalTaxBreaks = Math.floor(amtSaved(companies)/1000);

});

d3.csv("../csv/dv_data/comparison_data.csv", typeCastComparison, function(comparisons) {
  globalComparison = comparisons;
  globalComparison[0].color = "rgba(0, 0, 255, 0.4)";
  globalComparison[1].color = "rgba(0, 255, 0, 0.4)";
  globalComparison[2].color = "rgba(100, 0, 200, 0.4)";
  globalComparison[3].color = "rgba(255,255,0,0.4)";
  globalComparison[4].color = "rgba(255,0,255,0.4)";
  globalComparison[5].color = "rgba(0, 0, 255, 0.4)";
  globalComparison[6].color = "rgba(0, 255, 0, 0.4)";
  globalComparison[7].color = "rgba(255,100,255,0.4)";

});


