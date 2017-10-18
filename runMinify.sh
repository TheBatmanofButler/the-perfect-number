#!/bin/bash

minify js/src/slides.js -o js/dist/slides.js 
minify js/src/d3extras.js -o js/dist/d3extras.js 
minify js/src/barGraph.js -o js/dist/barGraph.js 
minify js/src/barGraphUpdates.js -o js/dist/barGraphUpdates.js 
minify js/src/proportion.js -o js/dist/proportion.js 
minify js/src/info.js -o js/dist/info.js 
minify js/src/dropdown.js -o js/dist/dropdown.js 
minify js/src/about.js -o js/dist/about.js 
minify js/src/global.js -o js/dist/global.js 
minify js/src/main.js -o js/dist/main.js 

echo "All javascript files are minified"