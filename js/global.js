var years = {};

var type = function (d) {
    d.rate = +d.rate;
    return d;
}

d3.csv("../csv/dv_data/interactive_data.csv", type, function(companies) {

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
                        };

  companies.map(function (d) {
    companyNames.push(d['company_name']);
    if (d['ceo_comp_amt'] != '') {
      companiesIPS.push(d);
    }
    var years_no_tax = d['years_no_tax']
    if (d['years_no_tax'] != '0') {
      companiesYearsNoTax[years_no_tax].push(d);
    }
  });

  createSlides(companies, companiesYearsNoTax);

  // populateDropdown(companyNames);


  // slide1(barGraph, width, y);
  // loadBarData(companies);
  // console.log(companiesIPS);
  // loadBarData(companies, companiesYearsNoTax);
  // loadBarData(companiesIPS);

  // loadBarGraph(companies);

  // populateBarGraph(x, y, barGraph, companies, companiesIPS);
  // populateBarGraph(x, y, barGraph, companiesIPS);

});