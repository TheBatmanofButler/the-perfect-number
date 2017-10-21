#!/bin/bash

./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/slides.js --script ../Pedal/corporate-tax-cuts/js/src/slides.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/d3extras.js --script ../Pedal/corporate-tax-cuts/js/src/d3extras.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/barGraph.js --script ../Pedal/corporate-tax-cuts/js/src/barGraph.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/barGraphUpdates.js --script ../Pedal/corporate-tax-cuts/js/src/barGraphUpdates.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/proportion.js --script ../Pedal/corporate-tax-cuts/js/src/proportion.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/info.js --script ../Pedal/corporate-tax-cuts/js/src/info.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/dropdown.js --script ../Pedal/corporate-tax-cuts/js/src/dropdown.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/about.js --script ../Pedal/corporate-tax-cuts/js/src/about.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/global.js --script ../Pedal/corporate-tax-cuts/js/src/global.js
./traceur --out ../Pedal/corporate-tax-cuts/js/src/temp/main.js --script ../Pedal/corporate-tax-cuts/js/src/main.js

echo "All javascript files are converted to ES5"

minify ../Pedal/corporate-tax-cuts/js/src/temp/slides.js -o ../Pedal/corporate-tax-cuts/js/dist/slides.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/d3extras.js -o ../Pedal/corporate-tax-cuts/js/dist/d3extras.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/barGraph.js -o ../Pedal/corporate-tax-cuts/js/dist/barGraph.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/barGraphUpdates.js -o ../Pedal/corporate-tax-cuts/js/dist/barGraphUpdates.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/proportion.js -o ../Pedal/corporate-tax-cuts/js/dist/proportion.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/info.js -o ../Pedal/corporate-tax-cuts/js/dist/info.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/dropdown.js -o ../Pedal/corporate-tax-cuts/js/dist/dropdown.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/about.js -o ../Pedal/corporate-tax-cuts/js/dist/about.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/global.js -o ../Pedal/corporate-tax-cuts/js/dist/global.js 
minify ../Pedal/corporate-tax-cuts/js/src/temp/main.js -o ../Pedal/corporate-tax-cuts/js/dist/main.js 

echo "All javascript files are minified"

rm -rf ../Pedal/corporate-tax-cuts/js/src/temp

echo "Delete temp folder"