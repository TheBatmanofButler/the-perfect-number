$('.about-button').click(function(){console.log('about clicked'),getAboutDiv()}),$('.typeahead').bind('typeahead:select',function(a,b){proportionInTransition?$('.typeahead').typeahead('val',''):'All companies'==b?openMapView(allCompanyData,'All Companies'):openMapView(allCompanyData,b)}),$('.slide-no-square').mouseover(function(){!slideInProgress&&allRegionsDrawn&&$(this).addClass('active-slide-no-square')}),$('.slide-no-square').mouseout(function(){$(this).text()!=currentSlide&&$(this).removeClass('active-slide-no-square')}),$('.slide-explore').mouseover(function(){!slideInProgress&&allRegionsDrawn&&$(this).addClass('active-slide-no-square')}),$('.slide-explore').mouseout(function(){null!=currentSlide&&$(this).removeClass('active-slide-no-square')}),$('.toggle-label').click(function(){1==$(this).find('.arrow-right').length?($(this).find('.arrow-right').replaceWith('<svg class="arrow-down" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">           <path d="M0 0l4 4 4-4h-8z" transform="translate(0 2)" />         </svg>'),$(this).find('.description').slideDown()):($(this).find('.arrow-down').replaceWith('<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">           <path d="M0 0v8l4-4-4-4z" transform="translate(2)" />         </svg>'),$(this).find('.description').slideUp())});var addBarGraphClicks=function(){inMapMode=!1,$('.bar-graph-viewer').click(function(){slideInProgress||(currentSlide+=1,1===currentSlide?$('#slide1').trigger('click'):2===currentSlide?$('#slide2').trigger('click'):3===currentSlide?$('#slide3').trigger('click'):4===currentSlide?$('#slide4').trigger('click'):5===currentSlide?$('#slide5').trigger('click'):6===currentSlide?$('#slide6').trigger('click'):7===currentSlide?$('#slide7').trigger('click'):8===currentSlide?$('#slide8').trigger('click'):9===currentSlide?$('#slide9').trigger('click'):10===currentSlide?$('.slide-explore').trigger('click'):void 0)})},removeBarGraphClicks=function(){$('.bar-graph-viewer').off('click')};addBarGraphClicks(),window.addEventListener('resize',function(){resizeBarGraph(),inMapMode&&updatePropGraph(!1)});