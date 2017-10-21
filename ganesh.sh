#!/bin/bash

./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/slides.js --script ../theCodes/corporate-tax-cuts/js/src/slides.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/d3extras.js --script ../theCodes/corporate-tax-cuts/js/src/d3extras.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/barGraph.js --script ../theCodes/corporate-tax-cuts/js/src/barGraph.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/barGraphUpdates.js --script ../theCodes/corporate-tax-cuts/js/src/barGraphUpdates.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/proportion.js --script ../theCodes/corporate-tax-cuts/js/src/proportion.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/info.js --script ../theCodes/corporate-tax-cuts/js/src/info.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/dropdown.js --script ../theCodes/corporate-tax-cuts/js/src/dropdown.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/about.js --script ../theCodes/corporate-tax-cuts/js/src/about.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/global.js --script ../theCodes/corporate-tax-cuts/js/src/global.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/temp/main.js --script ../theCodes/corporate-tax-cuts/js/src/main.js

echo "All javascript files are converted to ES5"

minify ../theCodes/corporate-tax-cuts/js/src/temp/slides.js -o ../theCodes/corporate-tax-cuts/js/dist/slides.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/d3extras.js -o ../theCodes/corporate-tax-cuts/js/dist/d3extras.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/barGraph.js -o ../theCodes/corporate-tax-cuts/js/dist/barGraph.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/barGraphUpdates.js -o ../theCodes/corporate-tax-cuts/js/dist/barGraphUpdates.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/proportion.js -o ../theCodes/corporate-tax-cuts/js/dist/proportion.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/info.js -o ../theCodes/corporate-tax-cuts/js/dist/info.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/dropdown.js -o ../theCodes/corporate-tax-cuts/js/dist/dropdown.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/about.js -o ../theCodes/corporate-tax-cuts/js/dist/about.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/global.js -o ../theCodes/corporate-tax-cuts/js/dist/global.js 
minify ../theCodes/corporate-tax-cuts/js/src/temp/main.js -o ../theCodes/corporate-tax-cuts/js/dist/main.js 

echo "All javascript files are minified"

rm -rf ../theCodes/corporate-tax-cuts/js/src/temp

echo "Delete temp folder"