/**
 * info.js
 *
 * @authors: Vaidehi Dalmia and Ganesh Ravichandran
 * @description: Functions for Info Box
 *
 */

let loadInfo = function (infoBoxData) {
  $('.info').animate({'opacity': 1}, 1000);
  $('.company-name').text(infoBoxData['companyName']);
  $('.industry').text(infoBoxData['industry']);
  $('.rate').text('Tax Rate: ' + infoBoxData['rate'] + '%');
  $('.tax-break').text('Tax Break: $' + infoBoxData['taxBreak']);
  if(infoBoxData['yearsNoTax'] > 0) {
    $('.years-no-tax').show()
    if(infoBoxData['yearsNoTax'] == 1) {
      $('.years-no-tax').text('Did not pay taxes for ' + infoBoxData['yearsNoTax'] + ' year');
    }
    else {
      $('.years-no-tax').text('Did not pay taxes for ' + infoBoxData['yearsNoTax'] + ' years');
    } 
  }
  else {
    $('.years-no-tax').hide();
  }
  let taxRebates = ['deferredTaxes','accDepreciation','dpad','researchExperiment','stockOptions'];
  for (let i in taxRebates) {
    if (infoBoxData[taxRebates[i]] == 'True') {
      $('.' + taxRebates[i]).show()
    }
    else {
      $('.' + taxRebates[i]).hide()
    }
  };
  $('.note').text(infoBoxData['note']);
}

let changeDynamicText = function (duration, newText, imgSrc) {
	return new Promise( function (resolve, reject) {
      console.log(newText)
  		$('.dynamic-text').animate({'opacity': 0}, duration)
        .promise()
        .then( function () {
          let p1,
              p2;

          p1 = $(this)
                .html(newText)
                .animate({'opacity': 1}, duration)
                .promise();
      		if (imgSrc)
      			p2 = $(this)
                    .prepend('<img src=' + imgSrc + ' class="dynamic-text-img"/>')
                    .animate({'opacity': 1}, duration)
                    .promise();
          else
            p2 = $.when();

          return $.when(p1, p2)
    		})
        .then(resolve)
  	});
};

