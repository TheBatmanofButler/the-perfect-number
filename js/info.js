var loadInfo = function (d) {
	$(".company-name").text(d.company_name);
	$(".industry").text(d.industry);
	$(".rate").text(d.rate);
	$(".tax-break").text(d.tax_break);
	$(".years-no-tax").text(d.years_no_tax);
	$(".tax-rebates").text(taxRebates);
	$(".note").text(d.note);
