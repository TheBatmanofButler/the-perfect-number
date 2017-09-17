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
	$('.arrow>img').show()

	$('#left-arrow').click( function (e) {
		console.log('left arrow clicked');
	});

	$('#right-arrow').click( function (e) {
		console.log('right arrow clicked');
	});

	createProportionGraph(10000);
	changeAreaColor(0,0,total35,'green',0.4);
	changeAreaColor(0,0,totalTaxBreaks,'green',0.8);

	$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
		if(suggestion=='All companies'){
			createProportionGraph(10000);
			$(".company-bar-name").text('All companies');
			changeAreaColor(0,0,total35,'green',0.4);
			changeAreaColor(0,0,totalTaxBreaks,'green',0.8);
		}
		else {
			createProportionGraph(50000);
			$(".company-bar-name").text(companyMap[slugify(suggestion)].company_name);
			loadInfo(slugify(suggestion),companyMap[slugify(suggestion)]);
			company35 = companyMap[slugify(suggestion)].profit*0.35;  
			console.log(company35);
			changeAreaColor(0,0,company35,'green',0.4);
			companyTaxBreak = companyMap[slugify(suggestion)].tax_break;
			console.log(companyTaxBreak)
			changeAreaColor(0,0,companyTaxBreak,'green',0.8);
		}	
	});
});

// openProportionGraph();