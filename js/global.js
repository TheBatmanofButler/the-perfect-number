

var slugify = function (string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

var type = function (d) {
  d['profit'] = +d['profit'];
  d['rate'] = +d['rate'];
  d['years_no_tax'] = +d['years_no_tax'];
  d['tax_break'] = +d['tax_break'];
  d['money'] = +d['money'];

  return d;
}

let createProportionAreas = function (comparisons, actualProfit, actualTaxBreak, convertConst) {

  let money35 = actualProfit * 0.35 / convertConst,
      num35PercentSquares = Math.floor(money35),

      taxBreak = actualTaxBreak / convertConst,
      numTaxBreakSquares = Math.floor(taxBreak),

      taxPaid = money35 - taxBreak,
      numTaxPaidSquares = Math.floor(taxPaid),
      unit;

  if (convertConst == 1e3)
    unit = ' billion';
  else if (convertConst == 10)
    unit = ' ten-million';
  else
    unit = ' million';

  let proportionAreas = [
    {
      'text': 'Company Tax if rate is 35%',
      'numSquares': num35PercentSquares,
      'color': 'rgba(128, 0, 0, 0.8)',
      'money': getMoneyString(money35, unit)
    },
    {
      'text': 'Company Tax Paid',
      'numSquares': numTaxPaidSquares,
      'color': 'rgba(255, 0, 0, 0.8)',
      'money': getMoneyString(taxPaid, unit)
    }
  ]

  if (taxPaid < 0) {
    proportionAreas.push({
      'text': 'Tax Break',
      'numSquares': numTaxBreakSquares,
      'color': 'rgba(48, 0, 0, 1)',
      'money': getMoneyString(taxBreak, unit)
    });
  }

  let filled = 0;
  for (let ii in comparisons) {

    let comparison = comparisons[ii],
        comparisonMoney = comparison['money'] / convertConst,
        numComparisonSquares = Math.floor(comparisonMoney);

    if (isValidComparison(comparison, numTaxBreakSquares, numComparisonSquares, filled)) {

      proportionAreas.push({
        'text': comparison['text'],
        'numSquares': numComparisonSquares,
        'color': comparison['color'],
        'money': getMoneyString(comparisonMoney, unit)
      });

      filled += numComparisonSquares;
    }
  }

  return proportionAreas;
}

let getMoneyString = function (money, unit) {
  return String(money.toFixed(2)) + unit;
}

var isValidComparison = function (comparison, numTaxBreakSquares, numComparisonSquares, filled) {
    enough = numComparisonSquares > 6,
    remaining = numTaxBreakSquares - filled,
    notTooMany = numComparisonSquares <= remaining;

    return (enough && notTooMany);
}

let inMapMode = false;
let proportionInTransition = false;
let allCompanyData;
var infoBoxData = {};
var comparisonData = {};
var totalProfits = 0;
var totalTaxBreaks = 0;
let currentSlide = 1;
let shouldFade = false;
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

d3.queue()
.defer(d3.csv, '../csv/dv_data/interactive_data.csv', type)
.defer(d3.csv, '../csv/dv_data/comparison_data.csv', type)
.await( function (error, companies, comparisons) {

  allCompanyData = companies;

  companies.map(function (d) {

    var slugName = slugify(d['company_name']);
    infoBoxData[slugName] = {
      'companyName':        d['company_name'],
      'profit':             d['profit'],
      'rate':               d['rate'],
      'industry':           d['industry'],
      'yearsNoTax':         d['years_no_tax'],
      'note':               d['note'],
      'taxBreak':           d['tax_break'],
      'stockOptions':       d['stock_options'],
      'researchExperiment': d['research_experiment'],
      'dpad':               d['dpad'],
      'accDepreciation':    d['acc_depreciation'],
      'deferredTaxes':      d['deferred_taxes']
    };

    companyNames.push(d['company_name']);

    if (d['ceo_comp_amt'] != '') {
      companiesIPS.push(d);
    }

    var yearsNoTax = d['years_no_tax'];
    if (yearsNoTax != '0') {
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
    if (empChangeRank != '0') {
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

    let convertConst = 1;
    // if (d['tax_break'] > 5000)
      // convertConst = 10;
    comparisonData[d['company_name']] = createProportionAreas(comparisons,
                                                                  d['profit'],
                                                                  d['tax_break'],
                                                                  convertConst);

    let taxBreak = d['tax_break'];
    if(taxBreak > 0) {
      totalProfits += d['profit'];
      totalTaxBreaks += taxBreak;
    }
  });

  comparisonData['All Companies'] = createProportionAreas(comparisons, totalProfits, totalTaxBreaks, 1e3);

  populateDropdown(companyNames);
  createSlides(companies,
    companiesYearsNoTax,
    companiesTop25,
    companiesRebates,
    companiesIPS,
    companiesTop3EmpChanges,
    companiesLostEmployees,
    companiesForeignDiff,
    companiesCompetitors);

});
