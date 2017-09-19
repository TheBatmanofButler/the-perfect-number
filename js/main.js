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
	$('.info').show()

	$('#left-arrow').click( function (e) {
		console.log('left arrow clicked');
	});

	$('#right-arrow').click( function (e) {
		console.log('right arrow clicked');
	});

	// createProportionGraph(total35);
	// allCompaniesPanel();
	createProportionGraph(1001);

	$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
		if(suggestion=='All companies'){
			createProportionGraph(total35);
			$(".company-bar-name").text('All companies');
			allCompaniesPanel();
		}
		else {
			
			$(".company-bar-name").text(companyMap[slugify(suggestion)].company_name);
			loadInfo(slugify(suggestion),companyMap[slugify(suggestion)]);
			company35 = companyMap[slugify(suggestion)].profit*0.35;
			companyTaxBreak = companyMap[slugify(suggestion)].tax_break;
			createProportionGraph(company35);  
			console.log(company35);
			console.log(companyTaxBreak);
			companiesPanel(company35,companyTaxBreak);

			// if(company35>companyTaxBreak) {
			// 	changeAreaColor(points, 0, company35,"rgba(255, 0, 0, 0.4)");
			// 	changeAreaColor(points, 0, companyTaxBreak,"rgba(255, 0, 0, 0.8)");
			// }
			// else {
			// 	changeAreaColor(points, 0, company35,"rgba(255, 0, 0, 0.4)");
			// 	changeAreaColor(points, company35, companyTaxBreak-company35,"rgba(255, 0, 0, 0.8)");
				
				
			// }
			
			
		}	
	});
});

// openProportionGraph();