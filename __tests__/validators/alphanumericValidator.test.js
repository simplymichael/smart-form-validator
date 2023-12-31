const { alphanumericValidator: validateAlphanumeric } = require( "../../src/validators");

const rule = { type: "alnum" };


module.exports = {
  arguments: ["value", ", rule"],
  test: alphanumericValidator,
};

function alphanumericValidator(it, expect) {
  it("should fail if value is undefined, null, false, or an empty string", function() {
    const testData = [undefined, null, false, ""];

    testData.forEach(value => expect(validateAlphanumeric(value, rule)).to.equal(false));
  });

  it("should fail if value contains other character except A - Z, 0 - 9 _, or -", function() {
    expect(validateAlphanumeric("hero_$", rule)).to.equal(false);
    expect(validateAlphanumeric("J0#n", rule)).to.equal(false);
    expect(validateAlphanumeric("$%^&*()/\\", rule)).to.equal(false);
  });

  it("should fail if value contains whitespace character", function() {
    expect(validateAlphanumeric("John doe", rule)).to.equal(false);
    expect(validateAlphanumeric("John doe 53", rule)).to.equal(false);
  });

  it("should allow whitespace character if `rule.allowWhitespace` is true", function() {
    const newRule = { ...rule, allowWhitespace: true };

    expect(validateAlphanumeric("John doe", newRule)).to.equal(true);
    expect(validateAlphanumeric("John doe 53", newRule)).to.equal(true);
  });

  it("should pass if value contains only A - Z, 0 - 9, _, or -", function() {
    expect(validateAlphanumeric("John", rule)).to.equal(true);
    expect(validateAlphanumeric("John1", rule)).to.equal(true);
    expect(validateAlphanumeric("John_9", rule)).to.equal(true);
    expect(validateAlphanumeric("John_", rule)).to.equal(true);
    expect(validateAlphanumeric("_John_", rule)).to.equal(true);
    expect(validateAlphanumeric("Jo-h-n-", rule)).to.equal(true);
    expect(validateAlphanumeric("-Jo-h-n", rule)).to.equal(true);
    expect(validateAlphanumeric("-Jo-h-n-", rule)).to.equal(true);
    expect(validateAlphanumeric("12-3_456789-0", rule)).to.equal(true);
  });

  it("should match any arbitrary length string if no length is specified", function() {
    const noWhitespaceValue = "ThisShouldB3AString0fVeryLongLengthWithoutWhitespaceThatShouldBeValidatedAgainst";
    const whitespaceValue = `This Should B3 A String 0f Very Long Length With
      Whitespace That Should Be Validated Against`;
  
    expect(validateAlphanumeric(noWhitespaceValue, rule)).to.equal(true);
    expect(validateAlphanumeric(whitespaceValue, { ...rule, allowWhitespace: true })).to.equal(true);
  });

  it("should fail if value is less than minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };

    expect(validateAlphanumeric("John", newRule)).to.equal(false);
    expect(validateAlphanumeric("J0hn", newRule)).to.equal(false);
  });

  it("should pass if value is at least the minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };

    expect(validateAlphanumeric("James", newRule)).to.equal(true);
    expect(validateAlphanumeric("J4m35", newRule)).to.equal(true);
  });

  it("should fail if value is greater than the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateAlphanumeric("James", newRule)).to.equal(false);
    expect(validateAlphanumeric("J4m3s", newRule)).to.equal(false);
  });

  it("should pass if value is at most the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateAlphanumeric("John", newRule)).to.equal(true);
    expect(validateAlphanumeric("J04n", newRule)).to.equal(true);
  });

  it("should fail if value is not between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["T0m", "Andr3w", "Fr4nc3s"];

    testData.forEach(value => expect(validateAlphanumeric(value, newRule)).to.equal(false));
  });

  it("should pass if value is between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 8 };
    const newRule = { ...rule, length };
    const testData = ["John", "J4m3s", "Fr4nc3s"];

    testData.forEach(value => expect(validateAlphanumeric(value, newRule)).to.equal(true));
  });

  it("should treat a length value of number as the maximum length", function() {
    const length = 5;
    const newRule = { ...rule, length };
    const testData = [
      { value: "Ev4",     expectation: true  },
      { value: "Frances", expectation: false },
      { value: "Gregory", expectation: false },
      { value: "James",   expectation: true  },
      { value: "J4ne",    expectation: true  },
      { value: "John",    expectation: true  },
      { value: "Tom",     expectation: true  },
      { value: "Andrew",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateAlphanumeric(value, newRule)).to.equal(expectation);
    });
  });

  it("should perform case-sensitive validation if `rule.matchCase` is true", function() {
    const newRule = { ...rule, matchCase: true };
    let testData = [
      { value: "Ev4",     expectation: false },
      { value: "EV4",     expectation: true  },
      { value: "FRANCES", expectation: true  }, 
      { value: "frances", expectation: false },
      { value: "Gregory", expectation: false },
      { value: "GREGORY", expectation: true  },
      { value: "John",    expectation: false },
      { value: "JOHN",    expectation: true  },
      { value: "Andrew",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateAlphanumeric(value, newRule)).to.equal(expectation);
    });
  });
}