const fs = require("node:fs");
const path = require("node:path");
const test = process.argv[process.argv.length - 1]; // e.g.: --SmartFormValidator, --SmartFormValidator::addField, etc.
const runSingleTest = test.indexOf("--") > -1;
const runMethodTest = test.indexOf("::") > -1;
const allFiles = fs.readdirSync(__dirname);
const testFiles = allFiles.filter(file => path.basename(file).endsWith(".test.js"));
const indexEnd = runMethodTest ? test.indexOf("::") : test.length;
const testFile = test
  .substring(0, indexEnd)          // strip away the `::` method call indicator
  .replace("--", "")               // strip off the `--` single test indicator
  .replace(/([A-Z])/g, "-$1")      // replace CAPS with their lowercase equivalent to match the target test file name
  .replace(/^-/, "").toLowerCase() // strip off the `-` preceding the first CAPS letter
  + ".test.js";                    // append `.test.js` to fully match the target file name


if(runSingleTest) {
  runTestFile(testFile);
} else {
  testFiles.forEach(runTestFile);
}

function runTestFile(testFile) {
  require(path.join(__dirname, testFile))();
}