var barGraphParams={barGraphWidth:null,barGraphHeight:null,x:null,y:null,yParam:null,data:null,marginTop:50,marginRight:40,marginBottom:100,marginLeft:80,axisEnding:'%',domainStart:null,domainEnd:null,barGraphTextX:null,barGraphTextValue:null},slideInProgress=!1,clearTop=function(){$('.slide-no-square-wrapper div').removeClass('active-slide-no-square')},createSlides=function(a,b,c,d,e,f,g,h,i,j){barGraphParams.data=a;var k=barGraphParams.marginTop,l=barGraphParams.marginRight,m=barGraphParams.marginBottom,n=barGraphParams.marginLeft,o=$('.bar-graph-viewer').width()-n-l,p=$('.bar-graph-viewer').height()-k-m;barGraphParams.barGraphWidth=o,barGraphParams.barGraphHeight=p,initBarGraph(),$('#slide1').click(function(){allRegionsDrawn&&1!=currentSlide&&(slideInProgress&&(shouldFade=!0),currentSlide=1,slide1(a),clearTop(),$('#slide1 div:first').addClass('active-slide-no-square'))}),$('#slide2').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide2(a),currentSlide=2,clearTop(),$('#slide2 div:first').addClass('active-slide-no-square'))}),$('#slide3').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide3(a,b),currentSlide=3,clearTop(),$('#slide3 div:first').addClass('active-slide-no-square'))}),$('#slide4').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide4(a,c),currentSlide=4,clearTop(),$('#slide4 div:first').addClass('active-slide-no-square'))}),$('#slide5').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide5(a,d),currentSlide=5,clearTop(),$('#slide5 div:first').addClass('active-slide-no-square'))}),$('#slide6').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide6(a,e,f,g,h),currentSlide=6,clearTop(),$('#slide6 div:first').addClass('active-slide-no-square'))}),$('#slide7').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide7(a,i),currentSlide=7,clearTop(),$('#slide7 div:first').addClass('active-slide-no-square'))}),$('#slide8').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide8(a,j),currentSlide=8,clearTop(),$('#slide8 div:first').addClass('active-slide-no-square'))}),$('#slide9').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),slide9(a),currentSlide=9,clearTop(),$('#slide9 div:first').addClass('active-slide-no-square'))}),$('.slide-explore').click(function(){allRegionsDrawn&&(slideInProgress&&(shouldFade=!0),clearTop(),$('.slide-explore').addClass('active-slide-no-square'),$('.typeahead').typeahead('val',''),openMapView(allCompanyData,'All Companies'))})},initBarGraph=function(){var a=barGraphParams.barGraphWidth,b=barGraphParams.barGraphHeight,c=barGraphParams.marginTop,d=barGraphParams.marginRight,e=barGraphParams.marginBottom,f=barGraphParams.marginLeft;updateXScale(),updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',50),updateYScale();var g=d3.select('.bar-graph-wrapper').append('svg').attr('class','bar-graph').attr('width',a+f+d).attr('height',b+c+e).append('g').attr('class','bar-graph-elements').attr('transform','translate('+f+','+c+')');createOpeningSlide(),g.append('g').attr('class','y-axis axis').style('opacity',0),d3.select('.bar-graph-elements').append('line').attr('class','percent-line').style('opacity',0);var h=barGraphParams.y,i=barGraphParams.x;g.append('text').attr('class','company-label').style('font-size','2vw');var j=barGraphParams.y.domain(),k=j[j.length-1];g.append('text').attr('class','bar-graph-text').attr('x',0.3*a).attr('y',h(k)),g.append('g').attr('class','x-axis axis').attr('transform','translate(0,'+h(0)+')').append('line').attr('x1',0).attr('x2',a).style('opacity',0),g.append('g').append('text').attr('class','y-label').attr('text-anchor','middle').style('font-size','15px')},getWordX=function(a,b){for(var c=50,d=0;d<b;d++)c+=a[d];return c},createOpeningSlide=function(){var a='"That\'s the number I wanted to get to. I wanted to start at 15 to get there.',b='We really had to start there because of the complexity of the numbers,',c='but 20 is a perfect number."',e=barGraphParams.barGraphWidth,d=barGraphParams.barGraphHeight,f=barGraphParams.marginTop,g=barGraphParams.marginRight,h=barGraphParams.marginBottom,i=barGraphParams.marginLeft,j=a.split('').concat(b.split('')).concat(c.split('')).concat('- Donald Trump on the U.S. corporate tax rate'.split('')),k=d3.select('.bar-graph').attr('width',null).attr('height',null).attr('viewBox','0 0 1300 500').attr('preserveAspectRatio','xMidYMid meet'),l=k.selectAll('.char').data(j,function(a){return a}).enter().append('g'),m=l.append('text').attr('class','quote-text');updateQuoteText(45,a.length,a.length+b.length,a.length+b.length+c.length),k.append('g').append('text').text('by').attr('class','pedal').attr('x',25).attr('y',260).style('opacity',0),k.append('g').append('text').text('Pedal').attr('class','pedal bolden').attr('x',70).attr('y',260).style('opacity',0),k.append('g').append('svg').attr('class','pedal-link bolden').attr('xmlns','http://www.w3.org/2000/svg').attr('x',160).attr('y',245).attr('viewBox','0 0 8 8').attr('width',15).attr('height',15).style('opacity',0).append('path').attr('d','M0 0v8h8v-2h-1v1h-6v-6h1v-1h-2zm4 0l1.5 1.5-2.5 2.5 1 1 2.5-2.5 1.5 1.5v-4h-4z'),d3.selectAll('.pedal, .pedal-link').on('click',function(){d3.event.stopPropagation(),window.open('http://home.pedal.tech')}),k.append('g').append('text').text('Click to advance').attr('class','click-advance').attr('x',1043).attr('y',30).style('opacity',0).style('font-style','italic'),d3.selectAll('.bolden').on('mouseover',function(){d3.selectAll('.bolden').style('fill','#566C58')}).on('mouseout',function(){d3.selectAll('.bolden').style('fill','#000')});var n=setTimeout(function(){var a=20,b=20,c=12;d3.selectAll('.quote-text').transition().duration(2e3).style('opacity',0),d3.selectAll('.highlight').transition().duration(1e3).style('fill','#367558').style('opacity',1).transition().delay(1e3).style('font-size','80px').attr('x',function(f,d){var g=' '==f?0.01*e:'r'==f||'c'==f?2.5*this.getComputedTextLength()+3:2.5*this.getComputedTextLength();var h;return 3>d?(h=a,a+=g):10>d?(h=b,b+=g):(h=c,c+=g),h}).attr('y',function(a,b){return 3>b?60:10>b?130:200}),d3.selectAll('.pedal, .pedal-link').transition().delay(2e3).duration(2e3).style('opacity',1).end(function(){d3.selectAll('.click-advance').transition().duration(2e3).style('opacity',1)})},50*j.length);openingScreenTimeouts.push(n)},sumTillPosition=function(a,b){for(var c=0,d=0;d<b;d++)c+=a[d];return c},updateQuoteText=function(a,b,c,e){var f=barGraphParams.barGraphWidth,g=20,h=20,j=20,d=d3.selectAll('.quote-text');d.style('font-size',30).style('opacity',0).text(function(a,b){return'|'==a&&d3.select(this).attr('id','cursor'),(7<b&&11>b||157<b&&172>b)&&d3.select(this).attr('class','highlight'),a}).attr('y',function(a,d){return d<b?40:d<c?80:d<e?120:160}).attr('x',function(a,d){var i=' '==a?0.01*f:this.getComputedTextLength();var k;return d<b?(k=g,g+=i):d<c?(k=h,h+=i):d<e?(k=j,j+=i):(k=j,j+=i),k}).each(function(b,c){var d=this,e=setTimeout(function(){d3.select(d).style('opacity',1)},c*a);openingScreenTimeouts.push(e)})},resizeBarGraph=function(){if(null==currentSlide){var a=$('.visualization').outerHeight()-$('.top').outerHeight()-$('.dynamic-text').outerHeight()-0.45*$(window).outerHeight();updateBarGraphParam('tickValues',[0,35]),updateBarGraphDims(a),updateXScale(),updateYScale(),updateYAxis(0,!1),updateCompanyLabel(0),updateBarGraphYLabel(0,'Rate'),updateXAxis(0),updateBarGraphSVG(0),updateBars(0,0,0)}else 1<currentSlide&&(updateBarGraphDims(),updateXScale(),updateYScale(),updateBarGraphSVG(0),updateBarGraphText(0),updateCompanyLabel(0),console.log(888),updateBarGraphYLabel(0),0!=d3.select('.percent-line').style('opacity')&&updatePercentLine(0),updateYAxis(0,!1),updateXAxis(0),updateBars(0,0,0),slideInProgress&&restartSlide(1e3))},openMapView=function(a,b){var c=$('.visualization').outerHeight()-$('.top').outerHeight()-$('.dynamic-text').outerHeight()-0.45*$(window).outerHeight();d3.select('.search-wrapper').transition().duration(1e3).style('visibility','visible').style('opacity',1);var d=Promise.resolve();return 1!=currentSlide||inMapMode||(d=d.then(function(){return fadeStart(500,a)})),currentSlide=null,d.then(function(){if(slideInProgress=!1,console.log(inMapMode),!inMapMode)return Promise.all([highlightAllBars('rgba(0,0,0,0.4)',0),hideBarGraphText(1e3)])}).then(function(){return d3.select('.dynamic-text').style('line-height','80px'),removeBarGraphClicks(),$('.proportion-graph-viewer').css('display','flex'),$('.proportion-graph-viewer').animate({height:'45vh'},1e3,'linear',function(){var a=slugify(b),c=infoBoxData[a];loadInfo(c),initPropGraph(b),updatePropGraph()}),Promise.all([$('.bar-graph-elements').animate({opacity:1}),updateBarGraphParam('marginTop',0),updateBarGraphParam('marginBottom',90),updateBarGraphDims(c),updateXScale(),updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',50),updateYScale(),updateBarGraphSVG(1e3),updateCompanyLabel(1e3),updateBarGraphParam('data',a),updateBarGraphParam('yParam','rate'),updatePercentLine(1e3),updateBarGraphParam('tickValues',[0,35]),updateBarGraphYLabel(1e3,'Rate'),updateYAxis(1e3),updateXAxis(1e3),updateBars(0,1e3,1e3)])}).then(function(){if(!inMapMode)return Promise.all([fadeOutPercentLine(1e3),highlightBarsSplit('rate',35,'#0FEA00','rgba(0,0,0,0.4)',1e3)])}).then(function(){inMapMode=!0})},closeMapView=function(){if(null!=currentSlide&&inMapMode)return $('.proportion-graph-viewer').animate({height:'0'},1e3,'linear'),$('.proportion-graph-viewer').hide(500),addBarGraphClicks(),updateStoryText(1e3,'')},fadeOutPercentLine=function(a){return new Promise(function(b){d3.select('.percent-line').transition().duration(a).style('opacity',0).end(b)})},highlightSomeBars=function(a,b,c){return new Promise(function(d){var e=d3.selectAll('.bar').filter(function(b){return-1<a.indexOf(b)});highlightBars(e,b,c).then(d)})},highlightBarsBelow=function(a,b,c,d){var e=d3.selectAll('.bar').filter(function(c){return c[a]<b});highlightBars(e,c,d)},highlightBarsSplit=function(a,b,c,e,d){return new Promise(function(f){d3.selectAll('.bar').transition().duration(d).ease(d3.easeLinear).style('fill',function(f){return f[a]>b?e:c}).end(f)})},highlightAllBars=function(a,b){return new Promise(function(c){var d=d3.selectAll('.bar');highlightBars(d,a,b).then(c)})},highlightBars=function(a,b,c){return new Promise(function(d){a.transition().duration(c).ease(d3.easeLinear).style('fill',b).end(d)})},fadeAll=function(a){return new Promise(function(b){d3.selectAll('.bar-graph-elements, .dynamic-text').transition().duration(a).style('opacity',0).end(b)})},showAll=function(a){return new Promise(function(b){d3.selectAll('.bar-graph-elements, .dynamic-text').transition().duration(a).style('opacity',1).end(b)})},fadeOpeningScreen=function(a){return new Promise(function(b){for(var c in openingScreenTimeouts){var d=openingScreenTimeouts[c];clearTimeout(d),d=0}openingScreenTimeouts=[],d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, .click-advance').transition().duration(a).style('opacity',0).end(function(){var a=barGraphParams.barGraphWidth,c=barGraphParams.barGraphHeight,d=barGraphParams.marginTop,e=barGraphParams.marginRight,f=barGraphParams.marginBottom,g=barGraphParams.marginLeft;d3.select('.bar-graph').attr('width',a+g+e).attr('height',c+d+f).attr('viewBox',null).attr('preserveAspectRatio',null),d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, click-advance').style('visibility','hidden').style('position','absolute'),b()})})},showOpeningScreen=function(a){slideInProgress=!1;var b=barGraphParams.barGraphWidth,c=barGraphParams.barGraphHeight,d=barGraphParams.marginTop,e=barGraphParams.marginRight,f=barGraphParams.marginBottom,g=barGraphParams.marginLeft,h=$('.graph-viewers').height();return new Promise(function(){fadeAll(500).then(function(){return Promise.all([appendStoryText(0,''),updateBarGraphParam('marginBottom',100),updateBarGraphParam('marginTop',50),updateBarGraphDims(h),updateBarGraphParam('axisEnding','%'),updateXScale(),updateBarGraphParam('domainStart',-15),updateBarGraphParam('domainEnd',50),updateYScale(),updateBarGraphSVG(0),updateBarGraphParam('barGraphTextValue',null),updateBarGraphParam('barGraphTextX',0.3),hideBarGraphText(0),updateCompanyLabel(0),updateBarGraphParam('data',a),updateBarGraphParam('yParam','rate'),updateBarGraphParam('tickValues',[0,35]),updateBarGraphYLabel(0),updateYAxis(0),updateXAxis(0),updatePercentLine(0),updateBars(0,0,0)])}).then(function(){var a=barGraphParams.barGraphWidth,b=20;totalWidth2=20,totalWidth3=12,d3.select('.bar-graph').attr('width',null).attr('height',null).attr('viewBox','0 0 1400 500').attr('preserveAspectRatio','xMidYMid meet'),d3.selectAll('.highlight').style('font-size','80px').attr('x',function(c,d){var e=' '==c?0.01*a:this.getComputedTextLength();var f;return 3>d?(f=b,b+=e):10>d?(f=totalWidth2,totalWidth2+=e):(f=totalWidth3,totalWidth3+=e),f}).attr('y',function(a,b){return 3>b?60:10>b?130:200}).transition().duration(1e3).style('fill','#367558').style('opacity',1),d3.selectAll('.pedal, .pedal-link, .click-advance').transition().duration(1e3).style('opacity',1),d3.selectAll('.quote-text, .highlight, .cursor, .pedal, .pedal-link, .click-advance').style('visibility',null).style('position',null)})})},fadeStart=function(a,b,c){var d=void 0===arguments[3]?-15:arguments[3],e=void 0===arguments[4]?50:arguments[4],f=void 0===arguments[5]?[0,35]:arguments[5],g=null!=d3.select('.bar-graph').attr('viewBox');return new Promise(function(h){Promise.resolve().then(function(){if(shouldFade)return fadeAll(a)}).then(function(){if(g)return Promise.all([fadeAll(a),fadeOpeningScreen(a)])}).then(function(){return highlightAllBars('rgba(0,0,0,0.4)',a)}).then(function(){var g=$('.graph-viewers').height(),h=barGraphParams.barGraphWidth;return closeMapView(),Promise.all([updateStoryText(a,''),appendStoryText(a,c),updateBarGraphParam('marginBottom',100),updateBarGraphParam('marginTop',50),updateBarGraphDims(g),updateBarGraphParam('axisEnding','%'),updateXScale(),updateBarGraphParam('domainStart',d),updateBarGraphParam('domainEnd',e),updateYScale(),updateBarGraphSVG(a),updateBarGraphParam('barGraphTextValue',null),updateBarGraphParam('barGraphTextX',0.3),hideBarGraphText(a),updateCompanyLabel(a),updateBarGraphParam('data',b),updateBarGraphParam('yParam','rate'),updateBarGraphParam('tickValues',f),updateBarGraphYLabel(a),updateYAxis(a),updateXAxis(a),updatePercentLine(a),updateBars(0,a,a)])}).then(function(){if(d3.select('.percent-line').moveToFront(),console.log(shouldFade),shouldFade||g&&1!=currentSlide)return shouldFade=!1,showAll(a)}).then(h)})};