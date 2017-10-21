#!/bin/bash

./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/slides.js --script ../theCodes/corporate-tax-cuts/js/src/slides.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/d3extras.js --script ../theCodes/corporate-tax-cuts/js/src/d3extras.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/barGraph.js --script ../theCodes/corporate-tax-cuts/js/src/barGraph.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/barGraphUpdates.js --script ../theCodes/corporate-tax-cuts/js/src/barGraphUpdates.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/proportion.js --script ../theCodes/corporate-tax-cuts/js/src/proportion.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/info.js --script ../theCodes/corporate-tax-cuts/js/src/info.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/dropdown.js --script ../theCodes/corporate-tax-cuts/js/src/dropdown.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/about.js --script ../theCodes/corporate-tax-cuts/js/src/about.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/global.js --script ../theCodes/corporate-tax-cuts/js/src/global.js
./traceur --out ../theCodes/corporate-tax-cuts/js/src/out/main.js --script ../theCodes/corporate-tax-cuts/js/src/main.js

echo "All javascript files are converted to ES5"