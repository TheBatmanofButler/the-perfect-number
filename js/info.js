let loadInfo = function (company_name, companyMap) {
	$('.company-name').text(companyMap['company_name']);
	$('.industry').text(companyMap['industry']);
	$('.rate').text('Tax Rate: ' + companyMap['rate'] + '%');
	$('.tax-break').text('Tax Break: $' + companyMap['tax_break'].toFixed(2) + ' million');
	if(companyMap['years_no_tax']>0) {
		$('.years-no-tax').show()
		if(companyMap['years_no_tax']==1) {
			$('.years-no-tax').text('Did not pay taxes for ' + companyMap['years_no_tax'] + ' year');
		}
		else {
			$('.years-no-tax').text('Did not pay taxes for ' + companyMap['years_no_tax'] + ' years');
		}	
	}
	else {
		$('.years-no-tax').hide();
	}
	let taxRebates = ['deferred_taxes','acc_depreciation','dpad','research_experiment','stock_options'];
	for (let i in taxRebates) {
		console.log(taxRebates[i]);
		if (companyMap[taxRebates[i]]=='True') {
			console.log(taxRebates[i]);
			$('.'+taxRebates[i]).show()
		}
		else {
			$('.'+taxRebates[i]).hide()
		}
	};
	$('.note').text(companyMap['note']);
}

let currentSlide = 1;
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

let changeDynamicText = function (duration, newText, imgSrc) {
	return new Promise( function (resolve, reject) {
		$('.dynamic-text').fadeOut(duration, function(){
    		$(this).html(newText).fadeIn(duration);
    		if (imgSrc)
    			$(this).prepend('<img src=' + imgSrc + ' class="dynamic-text-img"/>').fadeIn(duration);
		}).end(resolve)
  	});
};

