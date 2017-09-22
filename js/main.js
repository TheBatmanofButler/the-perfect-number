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
  $('.proportion-graph-viewer').show();
  $('.proportion-graph-viewer').animate({'height': '60vh'});
  $('.info').show();
  createProportionGraph('All Companies');
});

$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
  if(suggestion == 'All companies'){
    $('.company-bar-name').text('All companies');
    createProportionGraph('All Companies');
  }
  else {
    
    $('.company-bar-name').text(infoBoxData[slugify(suggestion)]['companyName']);
    loadInfo(infoBoxData[slugify(suggestion)]);
    createProportionGraph(infoBoxData[slugify(suggestion)]['companyName']);
  } 
});

$('.bar-graph-viewer').click( function (e) {
  if(currentSlide == 9) { currentSlide = 0; }
  currentSlide += 1;
  switch (currentSlide) {
    case 1: $("#slide1").trigger( "click" ); 
            break;
    case 2: $("#slide2").trigger( "click" );
            break;
    case 3: $("#slide3").trigger( "click" );
            break;
    case 4: $("slide4").trigger( "click" );
            break;
    case 5: $("#slide5").trigger( "click" );
            break;
    case 6: $("#slide6").trigger( "click" );
            break;
    case 7: $("#slide7").trigger( "click" );
            break;
    case 8: $("#slide8").trigger( "click" );
            break;
    case 9: $("#slide9").trigger( "click" );
            break;
  }   
});

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
}

var closeProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

// openProportionGraph();