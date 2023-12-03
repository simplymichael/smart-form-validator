const { describe } = require("./setup");
const { getTestDirectory, getTestFile, getTestFiles, singleFileTest } = require("./test-helpers");

const [testSingleMethod, testFile] = getTestFile();
const testDirectory = getTestDirectory(__filename);
const testFiles = getTestFiles(__dirname, testDirectory);


module.exports = function validatorsTest() {
  describe("validators", function() {
    if(testSingleMethod) {
      singleFileTest(__dirname, testDirectory, testFile);
    } else {
      testFiles.forEach(testFile => singleFileTest(__dirname, testDirectory, testFile));
    }
  });
};