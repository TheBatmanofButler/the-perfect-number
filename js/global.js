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

d3.queue()
.defer(d3.csv, "../csv/dv_data/interactive_data.csv", typeCastInteractive)
.defer(d3.csv, "../csv/dv_data/comparison_data.csv", typeCastComparison)
.await( function (error, companies, comparisons) {

  var companyNames = ['All companies'];
  globalComparison = {};
  companyMap = {};
  var totalProfits = 0;
  var totalTaxBreaks = 0;
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

  globalComparison = {};

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

    globalComparison[ d['company_name'] ] = createProportionAreas(comparisons, d['profit'], d['tax_break'], 1);

    var taxBreak = d['tax_break'];
    if(taxBreak > 0) {
      totalProfits += d['profit'];
      totalTaxBreaks += taxBreak;
    }
  });

  globalComparison['All Companies'] = createProportionAreas(comparisons, totalProfits, totalTaxBreaks, 1e3);

  populateDropdown(companyNames);
  // createSlides(companies,
  //   companiesYearsNoTax,
  //   companiesTop25,
  //   companiesRebates,
  //   companiesIPS,
  //   companiesTop3EmpChanges,
  //   companiesLostEmployees,
  //   companiesForeignDiff,
  //   companiesCompetitors);

  // loadBarData(companies);
});

var createProportionAreas = function (comparisons, profit, taxBreak, convertConst) {

  var num35PercentSquares = Math.floor(profit * 0.35 / convertConst);
  var numTaxBreakSquares = Math.floor(taxBreak / convertConst);

  var proportionAreas = [
    {
      'text': 'Company Tax if rate is 35%',
      'numSquares': num35PercentSquares,
      'color': "rgba(255, 0, 0, 0.4)"
    },
    {
      'text': 'Company Tax Break',
      'numSquares': numTaxBreakSquares,
      'color': "rgba(255, 0, 0, 0.8)"
    }
  ]

  var filled = 0;
  for (let datum in comparisons) {
    let comparison = comparisons[datum],
        numComparisonSquares = Math.floor(comparison['money'] / convertConst);

    if (isValidComparison(comparison, numTaxBreakSquares, numComparisonSquares, filled)) {
      proportionAreas.push({
        'text': comparison['text'],
        'numSquares': numComparisonSquares,
        'color': comparison['color']
      });

      filled += numComparisonSquares;
    }
  }

  return proportionAreas;
}

var isValidComparison = function (comparison, numTaxBreakSquares, numComparisonSquares, filled) {
    enough = numComparisonSquares > 6,
    remaining = numTaxBreakSquares - filled,
    notTooMany = numComparisonSquares <= remaining;

    return (enough && notTooMany);
}


