var loadInfo = function (company_name, companyMap) {
	$(".company-name").text(companyMap["company_name"]);
	$(".industry").text(companyMap["industry"]);
	$(".rate").text(companyMap["rate"]);
	$(".tax-break").text(companyMap["tax_break"]);
	$(".years-no-tax").text(companyMap["years_no_tax"]);
	// $(".tax-rebates").text(companyMap["taxRebates"]);
	// $(".note").text(companyMap["note"]);
}
