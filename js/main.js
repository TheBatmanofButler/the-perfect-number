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

	// createProportionGraph(globalComparison['All Companies']['35percent']['numSquares']);
	allCompaniesPanel('All Companies');
});

$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
	if(suggestion == 'All companies'){
		$('.company-bar-name').text('All companies');
		allCompaniesPanel('All Companies');
	}
	else {
		
		$('.company-bar-name').text(companyMap[slugify(suggestion)].company_name);
		loadInfo(slugify(suggestion),companyMap[slugify(suggestion)]);
		allCompaniesPanel(companyMap[slugify(suggestion)].company_name);
	}	
});

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
}

var closeProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

// openProportionGraph();