/**
 * main.js
 *
 * @authors: Ganesh Ravichandran and Vaidehi Dalmia
 * @description: Functions for dropdown/search for company names
 *
 */

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var initTypeahead = function(companyNames) {
  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 0
  },
  {
    name: 'companyNames',
    limit: 300,
    source: substringMatcher(companyNames)
  });
}