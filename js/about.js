let getAboutDiv = function () {
  console.log($('.about').width());
	if ($('.about').width()==0)
		$('.about').animate({'width': '30vw'});	
	else
		$('.about').animate({'width': '0'});
}

$(document).mouseup(function(e) {
    var aboutDiv = $('.about');
    if (!aboutDiv.is(e.target) && aboutDiv.has(e.target).length === 0) 
    	aboutDiv.animate({'width': '0vw'});
});