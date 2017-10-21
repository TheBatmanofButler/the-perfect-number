var slide1=function(a){slideInProgress=!0,$('.typeahead').typeahead('val',''),closeMapView();var b=$('.graph-viewers').height();updateBarGraphParam('marginBottom',100),updateBarGraphDims(b),showOpeningScreen(a)},slide2=function(a){slideInProgress=!0;var b=null!=d3.select('.bar-graph').attr('viewBox'),c=1e3;Promise.resolve().then(function(){if(shouldFade)return c=0,fadeAll(1e3)}).then(function(){if(b)return c=0,Promise.all([fadeAll(1e3),fadeOpeningScreen(1e3)])}).then(function(){var a=$('.graph-viewers').height();return closeMapView(),Promise.all([appendStoryText(0,'',1e3),hideBarGraphText(0),updateBarGraphParam('marginBottom',100),updateBarGraphDims(a),updateBarGraphParam('axisEnding','%'),updateXScale(),updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',50),updateYScale(),updateBarGraphSVG(1e3),fadeAll(c)])}).then(function(){return Promise.all([updateBarGraphParam('data',[]),updateBars(0,0,0),updateXAxis(0,!0),updateBarGraphParam('tickValues',[35]),updateYAxis(0,!0),hideBarGraphYLabel(0)])}).then(function(){return Promise.all([showAll(2e3),appendStoryText(2e3,'The federal corporate income tax rate is 35 percent...',1),updateYAxis(3e3),updatePercentLine(2e3)])}).then(function(){return appendStoryText(3e3,'but large corporations rarely pay that amount.')}).then(function(){return appendStoryText(0,'',1e3)}).then(function(){return Promise.all([appendStoryText(2e3,'The <b>Institute on Taxation and Economic Policy</b> studied 258 Fortune 500 companies that reported consistent profits from 2008 to 2015.',!1,null,!0),updateBarGraphParam('data',a),updateBarGraphParam('yParam','rate'),updateBarGraphParam('tickValues',[0,35]),updateBarGraphYLabel(3e3),updateXAxis(3e3),updateYAxis(3e3),updateBars(0,3e3,3e3)])}).then(function(){return appendStoryText(0,'',1e3)}).then(function(){return d3.select('.percent-line').moveToFront(),Promise.all([appendStoryText(2e3,'241 of those companies paid less than a 35% effective tax rate over the 8 years.'),highlightBarsSplit('rate',35,'#0FEA00','rgba(0,0,0,0.4)',3e3)])}).then(function(){slideInProgress=!1;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide3=function(a,b){var c=d3.select('.bar-graph-elements'),d=barGraphParams.barGraphWidth;slideInProgress=!0,fadeStart(500,a).then(function(){return appendStoryText(2e3,'These companies generated so many excess tax breaks that they sometimes reported negative taxes... ',0,null,!0)}).then(function(){return appendStoryText(2e3,'this means that they made <b>more</b> after taxes than before taxes in those years.',!1,null,!0)}).then(function(){var a=0,c=Promise.resolve();updateBarGraphParam('barGraphTextX',0.4);for(var d=function(d){a+=b[d].length;var e,f=' companies';1==a&&(f=' company'),e=1<d?a+f+' went at least '+d+' years without paying federal tax':a+f+' went at least '+d+' year without paying federal tax',c=c.then(function(){return Promise.all([updateBarGraphParam('barGraphTextValue',e),updateBarGraphText(2e3),highlightSomeBars(b[d],'#0FEA00',500)])})},e=Object.keys(b).length;0<e;e--)d(e);return c}).then(function(){slideInProgress=!1;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide4=function(a,b){d3.select('.bar-graph-elements');slideInProgress=!0,fadeStart(1e3,a).then(function(){return Promise.all([updateBarGraphParam('domainStart',-2500),updateBarGraphParam('domainEnd',4e4),updateYScale(),updateXAxis(1e3),updateBarGraphParam('tickValues',[-2500,0,20000,40000]),updateBarGraphParam('axisEnding',''),updateYAxis(1e3,!1),fadeOutPercentLine(1e3),updateBarGraphParam('yParam','tax_break'),updateBarGraphYLabel(1e3),updateBars(0,1e3,1e3)])}).then(function(){return Promise.all([])}).then(function(){return Promise.all([appendStoryText(2e3,'Just 25 companies claimed $286 billion in tax breaks (more than half of total) over the eight years between 2008 and 2015.',1,null,!0),highlightSomeBars(b,'#0FEA00',1e3)])}).then(function(){return Promise.all([updateXAxis(1e3),updateBars(0,1e3,1e3)])}).then(function(){slideInProgress=!1;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide5=function(a,b){d3.select('.bar-graph-elements');slideInProgress=!0;var c={deferredTaxes:['<b>deferred taxes</b>.',' These are taxes that are not paid in the current year, but may or may not come due in future years.'],accDepreciation:['<b>accelerated depreciation</b>.',' By deducting assets faster than they actually decline, companies benefit from higher interest savings or investment returns. It is one type of deferred tax.'],dpad:['the <b>Domestic Production Activities Deduction</b>, which incentivizes U.S. manufacturing.',' The law is so broadly written that Hollywood film companies deduct the films they "manufacture."'],researchExperiment:['the <b>Research and Experimentation Tax Credit</b>, which is meant to incentivize research activities.',' "Research" is defined very broadly in the tax code.'],stockOptions:['<b>executive stock options</b> to lower their taxes by generating phantom "costs" they never incur.']};fadeStart(2e3,a,'How do companies avoid paying taxes?').then(function(){return appendStoryText(2e3,' Deductions and loopholes.')}).then(function(){var a=highlightAllBars('rgba(0,0,0,0.4)',1e3),d=Object.keys(b),e=d[d.length-1],f=function(d){a=a.then(function(){var a=b[d].length,e=c[d];if(2==e.length||'stockOptions'==d){var f=a+' companies used '+e[0],g=e[1];return Promise.all([appendStoryText(2e3,f,1,null,!0),highlightSomeBars(b[d],'#0FEA00',700)]).then(function(){return'stockOptions'==d?appendStoryText(500,g,!1,null,!0):appendStoryText(4e3,g,!1,null,!0)}).then(function(){return highlightSomeBars(b[d],'#0FEA00',1500)})}var h=a+' companies used '+e[0];return Promise.all([appendStoryText(2e3,h,1,null,!0),highlightSomeBars(b[d],'#0FEA00',700)]).then(function(){return highlightSomeBars(b[d],'#0FEA00',1500)})}),d!=e&&(a=a.then(function(){return Promise.all([appendStoryText(700,'',100,null,!0),highlightAllBars('rgba(0,0,0,0.4)',700)])}))};for(var g in b)f(g);return a}).then(function(){slideInProgress=!1;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide6=function(a,b,c,d,e){d3.select('.bar-graph-elements');slideInProgress=!0;var f=barGraphParams.barGraphWidth,g=barGraphParams.barGraphHeight;fadeStart(1e3,a).then(function(){return Promise.all([appendStoryText(1e3,'"I am going to cut business taxes massively. They\'re going to start hiring people." - Trump',!1,'img/donald-trump.png'),fadeOutPercentLine(3e3),updateBars(0,3e3,3e3)])}).then(function(){return Promise.all([highlightSomeBars(b,'#0FEA00',2e3),appendStoryText(3e3,'The Institute for Policy Studies looked at 92 of these 258 companies which had effective tax rates below 20%.',50,null,!0)])}).then(function(){return Promise.all([updateBarGraphParam('data',b),updateXAxis(1e3),updateBarGraphParam('tickValues',[0,20,35]),updateYAxis(1e3),updateBars(1e3,1e3,1e3)])}).then(function(){return Promise.all([updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',20),updateYScale(),updateBarGraphParam('tickValues',[-15,0,20,35]),updateYAxis(1e3),updateXAxis(1e3),updateBars(0,1e3,1e3)])}).then(function(){return Promise.all([updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',20),updateYScale(),updateBarGraphParam('tickValues',[-15,0,20,35]),updateYAxis(1e3),updateBars(0,1e3,1e3)])}).then(function(){return Promise.all([appendStoryText(1e3,'A few companies did show significant employment growth over these 8 years...',50),updateBarGraphParam('domainStart',-70),updateBarGraphParam('domainEnd',2e3),updateYScale(),updateBarGraphParam('tickValues',[-70,0,500,1000,1500,2000]),updateYAxis(1e3),updateXAxis(1e3),updateBarGraphParam('yParam','adjusted_emp_change'),updateBarGraphYLabel(1e3),updateBars(0,1e3,1e3)])}).then(function(){return highlightAllBars('rgba(0,0,0,0.4)',1e3)}).then(function(){var a=Promise.resolve(),b=barGraphParams.barGraphWidth,d=function(b){var d=c[b],e=d[0].company_name,f=slugify(e);a=a.then(function(){return Promise.all([highlightSomeBars(c[b],'#0FEA00',1e3),updateCompanyLabel(1e3,e,15,1500)])}).then(function(){return Promise.all([highlightAllBars('rgba(0,0,0,0.4)',1e3)])})};for(var e in c)d(e);return a}).then(function(){return Promise.all([highlightSomeBars(d,'#0FEA00',2e3),appendStoryText(1e3,' But the majority of these companies laid off employees while maintaining profits and a low tax rate.',50),updateCompanyLabel(4e3,'',15,1500)])}).then(function(){return Promise.all([updateBarGraphParam('data',d),updateBarGraphParam('domainStart',-70),updateBarGraphParam('domainEnd',0),updateYScale(),updateXAxis(1e3),updateBarGraphParam('tickValues',[-70,0]),updateYAxis(1e3),updateBars(0,1e3,1e3)])}).then(function(){return highlightAllBars('rgba(0,0,0,0.4)',1e3)}).then(function(){return Promise.all([appendStoryText(2e3,'The CEOs of 33 of these companies raised their salaries while still cutting jobs.',50),highlightSomeBars(e,'#0FEA00',2e3)])}).then(function(){return highlightSomeBars(e,'#0FEA00',2e3)}).then(function(){return highlightAllBars('rgba(0,0,0,0.4)',1e3)}).then(function(){return Promise.all([appendStoryText(1500,'This is AT&T.',50),highlightSomeBars([d[1]],'#0FEA00',2e3)])}).then(function(){return Promise.all([appendStoryText(3e3,'AT&T\'s workforce was reduced by <b>79,450 employees</b> from 2008 to 2016',50,null,!0),highlightSomeBars([d[1]],'#0FEA00',1e3)])}).then(function(){return appendStoryText(3e3,'...more than any other company in this study.',!1,null,!0)}).then(function(){return appendStoryText(3e3,'"Lower taxes drives more investment, drives more hiring, drives greater wages." - Randall L. Stephenson, CEO of AT&T',1e3,'./img/randall-stephenson.png',!0)}).then(function(){return highlightSomeBars([d[1]],'#0FEA00',2e3)}).then(function(){return appendStoryText(1500,'He enjoyed a <b>$9 million raise</b> in this same time period.',1e3)}).then(function(){slideInProgress=!1,shouldFade=!0;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide7=function(a,b){d3.select('.bar-graph-elements');slideInProgress=!0,fadeStart(1e3,a).then(function(){return Promise.all([appendStoryText(5e3,'"America is one of the highest-taxed nations in the world. Reducing taxes will cause new companies and new jobs to come roaring back into our country." - Donald Trump',!1,'./img/donald-trump.png',!0)])}).then(function(){return Promise.all([appendStoryText(1500,'Of the 258 companies that showed consistent profits over 8 years...',2e3,null,!0),fadeOutPercentLine(2e3),updateBars(0,3e3,3e3)])}).then(function(){return Promise.all([appendStoryText(4e3,'107 had significant foreign profits (more than 10% of all profits)',!1,null,!0),highlightSomeBars(b,'#0FEA00',2e3)])}).then(function(){return Promise.all([updateBarGraphParam('data',b),updateBarGraphParam('yParam','us_foreign_diff'),updateBarGraphYLabel(2e3),updateBarGraphParam('domainStart',-40),updateBarGraphParam('domainEnd',40),updateYScale(),updateXAxis(2e3),updateBarGraphParam('tickValues',[-40,0,40]),updateYAxis(2e3),updateBars(0,2e3,2e3)])}).then(function(){return Promise.all([appendStoryText(5e3,'64 of these companies paid higher foreign tax rates on their foreign profits than they paid in U.S. taxes on their U.S. profits.',1,null,!0),highlightBarsSplit('us_foreign_diff',0,'#08BDBD','#FF9914',2e3)])}).then(function(){return appendStoryText(3e3,'These higher foreign tax rates do not seem to hinder companies from doing business abroad. This is just more evidence that corporate income tax levels are usually not a significant determinant of what companies do.',2e3,null,!0)}).then(function(){slideInProgress=!1,shouldFade=!0;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(2e3)})},slide8=function(a,b){d3.select('.bar-graph-elements');slideInProgress=!0,fadeStart(500,a).then(function(){return appendStoryText(1500,'Who loses out?')}).then(function(){var a=appendStoryText(3e3,'Competing companies often have drastically different tax rates.',1e3),c=-1,d=function(d){var e=b[d],f=e[0],g=e[1];a=a.then(function(){return Promise.all([appendStoryText(1e3,f.company_name+' '+f.rate+'%...',1e3),highlightSomeBars([f],'#0FEA00',1e3)])}).then(function(){return Promise.all([appendStoryText(1e3,'and '+g.company_name+' '+g.rate+'% in the '+g.industry+' industry.'),highlightSomeBars([g],'#0FEA00',1e3),f.rate-g.rate])}).then(function(){return highlightSomeBars([g],'#0FEA00',2e3)}).then(function(){if(c++,c<Object.keys(b).length-1)return highlightAllBars('rgba(0,0,0,0.4)',1e3)})};for(var e in b)d(e);return a}).then(function(){slideInProgress=!1;barGraphParams.barGraphWidth;updateBarGraphParam('barGraphTextValue','Click to continue'),updateBarGraphParam('barGraphTextX',0.8),updateBarGraphText(1500)})},slide9=function(a){d3.select('.bar-graph-elements');slideInProgress=!0,fadeStart(1e3,a).then(function(){return Promise.all([highlightBarsSplit('rate',35,'#0FEA00','rgba(0,0,0,0.4)',1e3),appendStoryText(1500,'Who else loses out?',1e3)])}).then(function(){return appendStoryText(2e3,' The American people.')}).then(function(){return appendStoryText(6e3,'There is plenty of blame to share for today\'s sad situation. These corporate loopholes and tax breaks are generally legal, and stem from laws passed over the years by Congress and signed by various presidents.',2e3,null,!0)}).then(function(){return appendStoryText(6e3,'But that does not mean that low-tax corporations bear no responsibility. The tax laws were not enacted in a vacuum; they were adopted in response to relentless corporate lobbying, threats and campaign support.',2e3,null,!0)}).then(function(){return appendStoryText(4e3,'These 241 companies saved a total of almost $527 billion over the last eight years.',2e3,null,!0)}).then(function(){slideInProgress=!1,$('.slide-explore').trigger('click')})};