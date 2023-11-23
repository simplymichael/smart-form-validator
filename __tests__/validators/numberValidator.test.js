const { numberValidator: validateNumber } = require( "../../src/validators");

const rule = { type: "number" };


module.exports = {
  arguments: ["value", ", rule"],
  test: numberValidator,
};

function numberValidator(it, expect) {
  it("should fail if value is undefined, null, false, or an empty string", function() {
    const testData = [undefined, null, false, ""];

    testData.forEach(value => expect(validateNumber(value, rule)).to.equal(false));
  });

  it("should fail if value contains non-numeric characters", function() {
    expect(validateNumber("1234h", rule)).to.equal(false);
    expect(validateNumber("hello", rule)).to.equal(false);
  });

  it("should pass if value contains only numeric characters", function() {
    expect(validateNumber("0", rule)).to.equal(true);
    expect(validateNumber("1", rule)).to.equal(true);
    expect(validateNumber("2", rule)).to.equal(true);
    expect(validateNumber("0123456789", rule)).to.equal(true);
  });

  it("should fail if value contains whitespace character", function() {
    expect(validateNumber("1234 5678", rule)).to.equal(false);
  });

  it("should allow whitespace character if `rule.allowWhitespace` is true", function() {
    const newRule = { ...rule, allowWhitespace: true };

    expect(validateNumber("1234 5678", newRule)).to.equal(true);
  });

  it("should match any arbitrary length number if no length is given", function() {
    expect(validateNumber("1234567890".repeat(20), rule)).to.equal(true);
  });

  it("should fail if value is less than minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };

    expect(validateNumber("1234", newRule)).to.equal(false);
  });

  it("should pass if value is at least the minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };
    
    expect(validateNumber("12345", newRule)).to.equal(true);
    expect(validateNumber(12345, newRule)).to.equal(true);
  });

  it("should fail if value is greater than the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateNumber(12345, newRule)).to.equal(false);
    expect(validateNumber("12345", newRule)).to.equal(false);
  });

  it("should pass if value is at most the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateNumber(1234, newRule)).to.equal(true);
    expect(validateNumber("1234", newRule)).to.equal(true);
  });

  it("should fail if value is not between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["123", "123456", 123, 123456];

    testData.forEach(value => expect(validateNumber(value, newRule)).to.equal(false));
  });

  it("should pass if value is between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["0123", "01234"];

    testData.forEach(value => expect(validateNumber(value, newRule)).to.equal(true));
  });

  it("should treat a length value of number as the maximum length", function() {
    const length = 5;
    const newRule = { ...rule, length };
    const testData = [
      { value: "0123456", expectation: false },
      { value: "56789",   expectation: true  },
      { value: "6598",    expectation: true  },
      { value: "321",     expectation: true  },
      { value: "357219",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateNumber(value, newRule)).to.equal(expectation);
    });
  });
}