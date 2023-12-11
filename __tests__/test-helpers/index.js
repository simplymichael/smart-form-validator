const fs = require("fs");
const path = require("path");
const { describe, expect, it } = require("../setup");

module.exports = {
  getTestDirectory,
  getTestFile,
  getTestFiles,
  singleFileTest,
  wrapWithDOMFunctionality,
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
  const indexFile = testFiles.filter(file => file.indexOf("index.test.js") > -1);
  let otherFiles;
  let returnFiles;

  if(constructorFile.length > 0) {
    otherFiles = testFiles.filter(file => file.indexOf("constructor.test.js") === -1);
    returnFiles = constructorFile.concat(otherFiles);
  } else if(indexFile.length > 0) {
    otherFiles = testFiles.filter(file => file.indexOf("index.test.js") === -1);
    returnFiles = indexFile.concat(otherFiles);
  } else {
    returnFiles = testFiles;
  }

  return returnFiles;
}

function singleFileTest(rootDirectory, testDirectory, testFile) {
  const { test, arguments: testArguments } = require(path.join(rootDirectory, testDirectory, testFile));
  
  describe(testFile.replace(".test.js", `(${testArguments.join(" ")})`), () => {
    test(it, expect);
  });
}

// The `setAttribute` and `classList` are to mimic their respective counterparts 
// on an HTML <input type="submit" ... 
// This is to avoid throwing any errors during effect registration for the toggle-submit-button effect
function wrapWithDOMFunctionality(obj) {
  const newObj = Object.create({ classes: [] });
  const syntheticProperties = { 
    setAttribute: (k, v) => this[k] = v, 
    removeAttribute: (key) => delete this[key],
    classList: {
      add: (className) => newObj.classes.push(className),
      remove: (className) => newObj.classes = newObj.classes.filter(c => c !== className)
    },
  };

  return Object.assign({}, obj, newObj, syntheticProperties);
}