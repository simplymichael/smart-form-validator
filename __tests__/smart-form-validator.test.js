/* eslint-env node, mocha */

const { SmartFormValidator } = require( "../src/smart-form-validator");
const { describe } = require("./setup");
const { getTestDirectory, getTestFile, getTestFiles, singleFileTest } = require("./test-helpers");

const [testSingleMethod, testFile] = getTestFile();
const testDirectory = getTestDirectory(__filename);
const testFiles = getTestFiles(__dirname, testDirectory);

module.exports = function SmartFormValidatorTest() {
  describe("SmartFormValidator", function() {
    beforeEach(function(done) {
      // Pass data between beforeEach, afterEach and it in mocha tests.
      // See: https://gist.github.com/icirellik/b9968abcecbb9e88dfb2
      // and: https://github.com/mochajs/mocha/issues/2245#issuecomment-523840745
      this.currentTest.validator = new SmartFormValidator();
      done();
    });

    if(testSingleMethod) {
      singleFileTest(__dirname, testDirectory, testFile);
    } else {
      testFiles.forEach(testFile => singleFileTest(__dirname, testDirectory, testFile));
    }
  });
};

