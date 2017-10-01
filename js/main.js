/**
 * main.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: jQuery event-listeners for DOM components
 *
 */

// $('#slide1').trigger( "click" );

$('.about-button').click( function (e) {
  console.log('about clicked');
  getAboutDiv();
});

$('.slide-explore').click( function (e) {
  $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
  $('.proportion-graph-viewer').css('display', 'flex');

  openMapView();
  $('.proportion-graph-viewer').show(1000);
  $('.proportion-graph-viewer').animate({'height': '45vh'}, 1000, function () {
    initPropGraph('All Companies');
    updatePropGraph();
  });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    if(proportionInTransition) {
      $('.typeahead').typeahead('val', '');
      // $('.typeahead').typeahead('setQuery', '');
      return 0;
    }
    if(suggestion == 'All companies'){
      $('.company-bar-name').text('All companies');
      initPropGraph('All Companies');
      updatePropGraph();
    }
    else {
      slugifySuggestion = slugify(suggestion);
      companyInfo = infoBoxData[slugifySuggestion];
      $('.company-bar-name').text(suggestion);
      loadInfo(companyInfo);
      initPropGraph(suggestion);
      updatePropGraph();
      
    }
  });
});

let addBarGraphClicks = function () {
  $('.bar-graph-viewer').click( function (e) {
    if (slideInProgress) return;
    currentSlide += 1;

    switch (currentSlide) {
      case 1: $("#slide1").trigger( "click" ); 
              break;
      case 2: $("#slide2").trigger( "click" );
              break;
      case 3: $("#slide3").trigger( "click" );
              break;
      case 4: $("#slide4").trigger( "click" );
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
      case 10: $('.slide-explore').trigger( "click" );
              break;
    }
  });
}

let removeBarGraphClicks = function () {
  $('.bar-graph-viewer').off('click');
}

addBarGraphClicks();

let resizeTimer;
window.addEventListener('resize', function () {
  $('.proportion-graph-wrapper').css('opacity', '0');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    $('.proportion-graph-wrapper').css('opacity', '1');
    resizeBarGraph();
    updatePropGraph();
  }, 250);
})
