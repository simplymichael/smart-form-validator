const { alphaValidator: validateAlpha } = require( "../../src/validators");

const rule = { type: "alpha" };


module.exports = {
  arguments: ["value", ", rule"],
  test: alphaValidator,
};

function alphaValidator(it, expect) {
  it("should fail if value is undefined, null, false, or an empty string", function() {
    const testData = [undefined, null, false, ""];

    testData.forEach(value => expect(validateAlpha(value, rule)).to.equal(false));
  });

  it("should fail if value contains other character except A - Z, _, or -", function() {
    expect(validateAlpha("hero_$", rule)).to.equal(false);
    expect(validateAlpha("J0hn", rule)).to.equal(false);
  });

  it("should fail if value contains whitespace character", function() {
    expect(validateAlpha("Jane doe", rule)).to.equal(false);
  });

  it("should allow whitespace character if `rule.allowWhitespace` is true", function() {
    const newRule = { ...rule, allowWhitespace: true };

    expect(validateAlpha("Jane doe", newRule)).to.equal(true);
  });

  it("should pass if value contains only A - Z, _, or -", function() {
    expect(validateAlpha("John", rule)).to.equal(true);
    expect(validateAlpha("John_", rule)).to.equal(true);
    expect(validateAlpha("_John_", rule)).to.equal(true);
    expect(validateAlpha("Jo-h-n-", rule)).to.equal(true);
    expect(validateAlpha("-Jo-h-n", rule)).to.equal(true);
    expect(validateAlpha("-Jo-h-n-", rule)).to.equal(true);
  });

  it("should match any arbitrary length string if no length is given", function() {
    let value = "ThisShouldBeAStringOfVeryLongLengthWithoutWhitespaceThatShouldBeValidatedAgainst";
    const result = validateAlpha(value, rule);
  
    expect(result).to.equal(true);
  });

  it("should fail if value is less than minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };
    const value = "John";
    const result = validateAlpha(value, newRule);

    expect(result).to.equal(false);
  });

  it("should pass if value is at least the minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };
    const value = "James";
    const result = validateAlpha(value, newRule);

    expect(result).to.equal(true);
  });

  it("should fail if value is greater than the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };
    const value = "James";
    const result = validateAlpha(value, newRule);

    expect(result).to.equal(false);
  });

  it("should pass if value is at most the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };
    const value = "John";
    const result = validateAlpha(value, newRule);

    expect(result).to.equal(true);
  });

  it("should fail if value is not between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["Tom", "Andrew"];

    testData.forEach(value => expect(validateAlpha(value, newRule)).to.equal(false));
  });

  it("should pass if value is between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["John", "James"];

    testData.forEach(value => expect(validateAlpha(value, newRule)).to.equal(true));
  });

  it("should treat a length value of number as the maximum length", function() {
    const length = 5;
    const newRule = { ...rule, length };
    const testData = [
      { value: "Gregory", expectation: false },
      { value: "James",   expectation: true  },
      { value: "John",    expectation: true  },
      { value: "Tom",     expectation: true  },
      { value: "Andrew",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateAlpha(value, newRule)).to.equal(expectation);
    });
  });

  it("should perform case-sensitive validation if `rule.matchCase` is true", function() {
    const newRule = { ...rule, matchCase: true };
    let testData = [
      { value: "Gregory", expectation: false },
      { value: "GREGORY", expectation: true  },
      { value: "John",    expectation: false },
      { value: "JOHN",    expectation: true  },
      { value: "Andrew",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateAlpha(value, newRule)).to.equal(expectation);
    });
  });
}