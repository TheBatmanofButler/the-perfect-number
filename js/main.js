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
	createProportionGraph(1500);
	changeAreaColor(0,0,total35,'green',0.4);
	changeAreaColor(0,0,totalTaxBreaks,'green',0.8);

	$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
		createProportionGraph(9000);
		loadInfo(slugify(suggestion),companyMap[slugify(suggestion)]);
		company35 = companyMap[slugify(suggestion)].profit*0.35;  
		console.log(company35);
		changeAreaColor(0,0,company35,'green',0.4);
		companyTaxBreak = companyMap[slugify(suggestion)].tax_break;
		console.log(companyTaxBreak)
		changeAreaColor(0,0,companyTaxBreak,'green',0.8);
	});
});

// openProportionGraph();