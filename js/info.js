/**
 * info.js
 *
 * @authors: Vaidehi Dalmia and Ganesh Ravichandran
 * @description: Functions for Info Box
 *
 */

let loadInfo = function (infoBoxData) {

  $('.info').animate({'opacity': 0}, 500, function () {
    
    $('.info').animate({'opacity': 1}, 500);

    $('.company-name').text(infoBoxData['companyName']);
    $('.industry').text(infoBoxData['industry']);
    $('.rate').html('<b>Tax Rate</b>: <font size="3px">' + infoBoxData['rate'] + '%</font>');
    let taxBreak = infoBoxData['taxBreak'];

    if (taxBreak[0] == '-') {
      taxBreak = taxBreak.slice(1);
      $('.tax-break').html('<b>Tax Break</b>: <font size="3px">Paid $' + taxBreak + ' beyond the standard 35% rate</font>');
    }
    else
      $('.tax-break').html('<b>Tax Break</b>: <font size="3px">$' + infoBoxData['taxBreak'] + '</font>');

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

    let taxRebates = {'deferredTaxes': 'deferred-taxes',
                      'accDepreciation': 'acc-depreciation',
                      'dpad': 'dpad',
                      'researchExperiment': 'research-experiment',
                      'stockOptions': 'stock-options'};
    
    for (let rebate in taxRebates) {
      if (infoBoxData[rebate] == 'True') {
        $('.' + taxRebates[rebate]).show()
      }
      else {
        $('.' + taxRebates[rebate]).hide()
      }
    };
    
    $('.note>.description').text(infoBoxData['note']);
    if (infoBoxData['note']) {
      $('.note').show()
    }
    else {
      $('.note').hide()
    }
  });
}

let callStoryText = function (duration, newText) {
	return new Promise( function (resolve, reject) {

    d3.select('.dynamic-text')
      .append('text')
      .style('opacity', 0)
      .text(newText)
      .transition()
      .duration(duration)
      .style('opacity', 1)
      .end(resolve);
      // .end(function () {
      //   if (newText2) {
      //     d3.select('.dynamic-text')
      //       .append('text')
      //       .text(newText2)
      //       .style('opacity', 0)
      //       .transition()
      //       .duration(duration)
      //       .style('opacity', 1)
      //       .end(resolve);
      //   }
      // });
  	});
};