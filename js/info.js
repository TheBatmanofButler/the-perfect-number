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
		
	// $('.tax-rebates').text(companyMap['taxRebates']);
	// var taxRebates = '';
	// if(companyMap['deferred_taxes']=='True') {taxRebates += 'Deferred taxes, '};
	// if(companyMap['acc_depreciation']=='True') {taxRebates += 'Accelerated Depreciation, '};
	// if(companyMap['dpad']=='True') {taxRebates += 'Domestic Production Activities Deduction, '};
	// if(companyMap['research_experiment']=='True') {taxRebates += 'Research and Experimentation tax credit, '};
	// if(companyMap['stock_options']=='True') {taxRebates += 'Stock options, '};
	// $('.tax-rebates').text(taxRebates);
	// if(taxRebates) {
	// 	$('.tax-rebates').text('Tax Rebates: ' + taxRebates.slice(0,taxRebates.length -2));
	// }
	// else {
	// 	$('.tax-rebates').hide();
	// }
	$('.note').text(companyMap['note']);
}
