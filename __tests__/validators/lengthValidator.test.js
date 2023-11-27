const { lengthValidator: validateLength } = require( "../../src/validators");


module.exports = {
  arguments: ["value", ", rule"],
  test: lengthValidator,
};

function lengthValidator(it, expect) {
  it("should fail if value is undefined, null, or false", function() {
    const testData = [undefined, null, false];

    testData.forEach(value => expect(validateLength(value, {length: 0})).to.equal(false));
  });

  it("should match any arbitrary length string if no length is given", function() {
    let value = "AStringOfVeryLongLengthWithoutWhitespaceThatShouldBeValidatedAgainst";
  
    expect(validateLength(value, {})).to.equal(true);
  });

  it("should match an empty string if no length is given", function() {
    expect(validateLength("", {})).to.equal(true);
  });

  it("should fail if value is less than minimum specified length", function() {
    const length = { min: 5 };
    const rule = { length };

    expect(validateLength("John", rule)).to.equal(false);
  });

  it("should pass if value is at least the minimum specified length", function() {
    const length = { min: 5 };
    const rule = { length };

    expect(validateLength("James", rule)).to.equal(true);
  });

  it("should fail if value is greater than the maximum specified length", function() {
    const length = { max: 4 };
    const rule = { length };

    expect(validateLength("Janet", rule)).to.equal(false);
  });

  it("should pass if value is at most the maximum specified length", function() {
    const length = { max: 4 };
    const rule = { length };

    expect(validateLength("Joan", rule)).to.equal(true);
  });

  it("should fail if value is not between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const rule = { length };
    //const testData = ["Ada", "Miranda", "Tom", "Andrew", "Frances", 123];
    const testData = ["Ada", "Miranda"];

    testData.forEach(value => expect(validateLength(value, rule)).to.equal(false));
  });

  it("should pass if value is between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const rule = { length };
    const testData = ["John", "Janet", 1234, "56789"];

    testData.forEach(value => expect(validateLength(value, rule)).to.equal(true));
  });

  it("should treat a length value of number as the maximum length", function() {
    const length = 5;
    const rule = { length };
    const testData = [
      { value: "Frances", expectation: false },
      { value: "James",   expectation: true  },
      { value: "Joan",    expectation: true  },
      { value: "Ada",     expectation: true  },
      { value: "Andrew",  expectation: false },
    ];

    testData.forEach(({ value, expectation}) => {
      expect(validateLength(value, rule)).to.equal(expectation);
    });
  });

  it("should support newline in strings", function() {
    const length = { min: 5 };
    const rule = { length };
    const value = `A 
      multiline 
      string`;

    expect(validateLength(value, rule)).to.equal(true);
  });
}