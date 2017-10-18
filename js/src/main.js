/**
 * main.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: jQuery event-listeners for DOM components
 *
 */

$('.about-button').click( function (e) {
  console.log('about clicked');
  getAboutDiv();
});

$('.typeahead').bind('typeahead:select', function(ev, suggestion) {
  if (proportionInTransition)
    $('.typeahead').typeahead('val', '');

  else if (suggestion == 'All companies')
    openMapView(allCompanyData, 'All Companies');

  else
    openMapView(allCompanyData, suggestion);
});

$('.slide-no-square').mouseover( function () {
  if (!slideInProgress && allRegionsDrawn) 
    $(this).addClass('active-slide-no-square');
});

$('.slide-no-square').mouseout( function () {
  if ($(this).text() != currentSlide)
    $(this).removeClass('active-slide-no-square');
});

$('.slide-explore').mouseover( function () {
  if (!slideInProgress && allRegionsDrawn) 
    $(this).addClass('active-slide-no-square');
});

$('.slide-explore').mouseout( function () {
  if (currentSlide != null)
    $(this).removeClass('active-slide-no-square');
});

$('.toggle-label').click( function () {

  if ($(this).find('.arrow-right').length == 1) {
    $(this).find('.arrow-right').replaceWith(
        '<svg class="arrow-down" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"> \
          <path d="M0 0l4 4 4-4h-8z" transform="translate(0 2)" /> \
        </svg>'
      )

    $(this).find('.description').slideDown();
  }
  else {
    $(this).find('.arrow-down').replaceWith(
        '<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"> \
          <path d="M0 0v8l4-4-4-4z" transform="translate(2)" /> \
        </svg>'
      )
    $(this).find('.description').slideUp();
  }
});

let addBarGraphClicks = function () {
  inMapMode = false;
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

window.addEventListener('resize', function () {
  resizeBarGraph();
  if (inMapMode)
    updatePropGraph(false);
})
