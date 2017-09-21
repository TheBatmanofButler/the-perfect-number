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

$('.slide-no').click( function (e) {
	$('.proportion-graph-viewer').hide();
	$('.info').hide();
});

$('.slide-explore').click( function (e) {
	// $('.proportion-graph-viewer').show();
	$('.proportion-graph-viewer').animate({'height': '60vh'});
	// $('.bar-graph-viewer').animate({'height': '30vh'});
	// $('.info').show();
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