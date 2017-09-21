var loadInfo = function (company_name, companyMap) {
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
	var taxRebates = ['deferred_taxes','acc_depreciation','dpad','research_experiment','stock_options'];
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
