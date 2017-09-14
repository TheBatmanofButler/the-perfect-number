d3.csv("../csv/dv_data/interactive_data.csv", function(companies) {

  var companyNames = ['All companies'];

  data = companies.map(function(d)
  {
    companyNames.push(d.company_name);
  });

  populateDropdown(companyNames);


});