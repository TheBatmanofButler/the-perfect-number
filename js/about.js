let getAboutDiv = function () {
	if ($('.about').width()==0)
		$('.about').animate({'width': '30vw'});	
	else
		$('.about').animate({'width': '0vw'});
}

$(document).mouseup(function(e) {
    var aboutDiv = $('.about');
    // if the target of the click isn't the container nor a descendant of the container
    if (!aboutDiv.is(e.target) && aboutDiv.has(e.target).length === 0) 
    	aboutDiv.animate({'width': '0vw'});
});