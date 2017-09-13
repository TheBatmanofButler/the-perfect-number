/**
 * graph.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: Functions to modify graph components in DOM
 *
 */

function openProportionGraph() {
	$('.proportion-graph-viewer').animate({'height': '60vh'});
	// $('.arrow>img').show(1000);
}

function closeProportionGraph() {
	// $('.arrow>img').hide(1000);
	$('.proportion-graph-viewer').animate({'height': '0vh'});
}