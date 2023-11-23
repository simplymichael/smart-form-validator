const { asciiTextValidator: validateAsciiText } = require( "../../src/validators");

const rule = { type: "text" };


module.exports = {
  arguments: ["value", ", rule"],
  test: asciiTextValidator,
};

function asciiTextValidator(it, expect) {
  it("should fail if value is undefined, null, false, or an empty string", function() {
    const testData = [undefined, null, false, ""];

    testData.forEach(value => expect(validateAsciiText(value, rule)).to.equal(false));
  });

  it("should fail if value contains other character except ASCII characters", function() {
    const text = "J4n3";
    const ascii = [
      "@", "$", "%", "^", "&", "*", "(", ")", "/", "\\", "[", 
      "]", "{", "}", "'", "\"", "~", "!", "#", "_", "=", "-"
    ];

    const nonAscii = [
      "£", "¤", "¢", "¥", "¦", "§", "¨", "©", "¬", "®", 
      "±", "µ", "¶", "¾", "¿", "Æ", "Ð", "Þ", "ß", "Ø"
    ];

    expect(validateAsciiText(text, rule)).to.equal(true);

    ascii.forEach(char => expect(validateAsciiText(`${text}_${char}`, rule)).to.equal(true));
    nonAscii.forEach(char => expect(validateAsciiText(`${text}_${char}`, rule)).to.equal(false));
  });

  it("should allow whitespace", function() {
    expect(validateAsciiText("John doe", rule)).to.equal(true);
    expect(validateAsciiText("John doe 53", rule)).to.equal(true);
  });

  it("should pass if value contains only ASCII characters", function() {
    expect(validateAsciiText("John", rule)).to.equal(true);
    expect(validateAsciiText("John1", rule)).to.equal(true);
    expect(validateAsciiText("John_9", rule)).to.equal(true);
    expect(validateAsciiText("John_", rule)).to.equal(true);
    expect(validateAsciiText("_John_", rule)).to.equal(true);
    expect(validateAsciiText("Jo-h-n-", rule)).to.equal(true);
    expect(validateAsciiText("-Jo-h-n", rule)).to.equal(true);
    expect(validateAsciiText("-Jo-h-n-", rule)).to.equal(true);
    expect(validateAsciiText("12-3_456789-0", rule)).to.equal(true);
    expect(validateAsciiText("@$%^&*()/\\[]{}'\"~!#_=-", rule)).to.equal(true);
  });

  it("should match any arbitrary length string if no length is specified", function() {
    const noWhitespaceValue = "ThisShouldB3AString0fVeryLongLengthWithoutWhitespaceThatShouldBeValidatedAgainst";
    const whitespaceValue = `This Should B3 A String 0f Very Long Length With
      Whitespace That Should Be Validated Against`;
  
    expect(validateAsciiText(noWhitespaceValue, rule)).to.equal(true);
    expect(validateAsciiText(whitespaceValue, rule)).to.equal(true);
  });

  it("should fail if value is less than minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };

    expect(validateAsciiText("John", newRule)).to.equal(false);
    expect(validateAsciiText("J0hn", newRule)).to.equal(false);
  });

  it("should pass if value is at least the minimum specified length", function() {
    const length = { min: 5 };
    const newRule = { ...rule, length };

    expect(validateAsciiText("James", newRule)).to.equal(true);
    expect(validateAsciiText("J4m35", newRule)).to.equal(true);
  });

  it("should fail if value is greater than the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateAsciiText("James", newRule)).to.equal(false);
    expect(validateAsciiText("J4m3s", newRule)).to.equal(false);
  });

  it("should pass if value is at most the maximum specified length", function() {
    const length = { max: 4 };
    const newRule = { ...rule, length };

    expect(validateAsciiText("John", newRule)).to.equal(true);
    expect(validateAsciiText("J04n", newRule)).to.equal(true);
  });

  it("should fail if value is not between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 5 };
    const newRule = { ...rule, length };
    const testData = ["T0m", "Andr3w", "Fr4nc3s"];

    testData.forEach(value => expect(validateAsciiText(value, newRule)).to.equal(false));
  });

  it("should pass if value is between minimim and maximum specified length (inclusive)", function() {
    const length = { min: 4, max: 8 };
    const newRule = { ...rule, length };
    const testData = ["John", "J4m3s", "Fr4nc3s"];

    testData.forEach(value => expect(validateAsciiText(value, newRule)).to.equal(true));
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
      expect(validateAsciiText(value, newRule)).to.equal(expectation);
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
      expect(validateAsciiText(value, newRule)).to.equal(expectation);
    });
  });
}