/* eslint-env node, mocha */

const { describe } = require("./setup");
const { getTestDirectory, getTestFile, getTestFiles, singleFileTest } = require("./test-helpers");

const [testSingleMethod, testFile] = getTestFile();
const testDirectory = getTestDirectory(__filename);
const testFiles = getTestFiles(__dirname, testDirectory);


module.exports = function methodsTest() {
  describe("methods", function() {
    beforeEach(function(done) {
      // Pass data between beforeEach, afterEach and it in mocha tests.
      // See: https://gist.github.com/icirellik/b9968abcecbb9e88dfb2
      // and: https://github.com/mochajs/mocha/issues/2245#issuecomment-523840745
      const context = Object.create({
        fields: [],
        addField: require("../src/methods/addField"),
        addFields: require("../src/methods/addFields"),
        addRule: require("../src/methods/addRule"),
        addValidator: require("../src/methods/addValidator"),
        getValidators: require("../src/methods/getValidators"),
        getEffects: require("../src/methods/getEffects"),
        getField: require("../src/methods/getField"),
        getFields: require("../src/methods/getFields"),
        removeRule: require("../src/methods/removeRule"),
        toJSON: require("../src/methods/toJSON"),
        useEffect: require("../src/methods/useEffect"),
        validate: require("../src/methods/validate"),
        watch: require("../src/methods/watch"),
      });

      this.currentTest.context = context;
      done();
    });

    if(testSingleMethod) {
      singleFileTest(__dirname, testDirectory, testFile);
    } else {
      testFiles.forEach(testFile => singleFileTest(__dirname, testDirectory, testFile));
    }
  });
};