/**
 * main.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: jQuery event-listeners for DOM components
 *
 */

$('.about').click( function (e) {
	console.log('about clicked');
});

$('.slide-explore').click( function (e) {
	$('.proportion-graph-viewer').animate({'height': '60vh'})
	$('.info').show()

	createProportionGraph(total35);
	allCompaniesPanel();
});

$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
	if(suggestion == 'All companies'){
		$('.company-bar-name').text('All companies');
		createProportionGraph(total35);
		allCompaniesPanel();
	}
	else {
		
		$('.company-bar-name').text(companyMap[slugify(suggestion)].company_name);
		loadInfo(slugify(suggestion),companyMap[slugify(suggestion)]);
		company35 = companyMap[slugify(suggestion)].profit*0.35;
		companyTaxBreak = companyMap[slugify(suggestion)].tax_break;
		createProportionGraph(company35);
		companiesPanel(company35,companyTaxBreak);
	}	
});

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
}

var closeProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

// openProportionGraph();