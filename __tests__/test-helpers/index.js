const fs = require("fs");
const path = require("path");
const { describe, expect, it } = require("../setup");

module.exports = {
  getTestDirectory,
  getTestFile,
  getTestFiles,
  singleFileTest,
};

function getTestDirectory(testFile) {
  return path.basename(testFile, ".test.js");
}

function getTestFile() {
  // e.g SmartFormValidator::addField, SmartField::addValidator, validators::emailValidator
  const test = process.argv[process.argv.length - 1];
  const testSingleMethod = test.indexOf("::") > -1;
  const testFile = `${test.substring(test.indexOf("::") + 2)}.test.js`;

  return [testSingleMethod, testFile];
}

function getTestFiles(rootDirectory, testDirectory) {
  const testFiles = fs.readdirSync(path.join(rootDirectory, testDirectory));
  const constructorFile = testFiles.filter(file => file.indexOf("constructor.test.js") > -1);
  const otherFiles = testFiles.filter(file => file.indexOf("constructor.test.js") === -1);

  return constructorFile.concat(otherFiles);
}

function singleFileTest(rootDirectory, testDirectory, testFile) {
  const { test, arguments: testArguments } = require(path.join(rootDirectory, testDirectory, testFile));
  
  describe(testFile.replace(".test.js", `(${testArguments.join(" ")})`), () => {
    test(it, expect);
  });
}