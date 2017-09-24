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

$('.slide-no').click( function (e) {
  $('.proportion-graph-viewer').hide();
});

$('.slide-explore').click( function (e) {
  $('.slide-no-square-wrapper div').removeClass('active-slide-no-square');
  let currentCompany = 'All Companies';
  $('.proportion-graph-viewer').css('display', 'flex');


  let newHeight = $(".visualization").outerHeight() 
                  - ($(".top").outerHeight() 
                  + $(".dynamic-text").outerHeight()
                  + $(window).outerHeight() * 0.45);
  isMapMode = true;
  resizeBarGraph(newHeight);
  $('.proportion-graph-viewer').animate({'height': '45vh'}, 1000);
  createProportionGraph('All Companies');
  //   console.log($('.bar-graph-viewer').css('height'));

  // });

  $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
    if(suggestion == 'All companies'){
      $('.company-bar-name').text('All companies');
      createProportionGraph('All Companies');
    }
    else {
      slugifySuggestion = slugify(suggestion);
      companyInfo = infoBoxData[slugifySuggestion];
      $('.company-bar-name').text(suggestion);
      loadInfo(companyInfo);
      createProportionGraph(suggestion);
      currentCompany = suggestion;
    } 
    // $('.typeahead').typeahead('val','');
  });

  window.addEventListener('resize', function () {
    createProportionGraph(currentCompany);

  })
});

$('.bar-graph-viewer').click( function (e) {
  // if(currentSlide == 9) { currentSlide = 0; }
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

var openProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '60vh'});
}

var closeProportionGraph = function () {
  $('.proportion-graph-viewer').animate({'height': '0vh'});
}

window.addEventListener('resize', function () {
  resizeBarGraph();
})

// openProportionGraph();