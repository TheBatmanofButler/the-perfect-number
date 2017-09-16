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
});

// openProportionGraph();