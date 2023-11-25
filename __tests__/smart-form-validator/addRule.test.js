const errorMessages = require("../../src/error-messages");

module.exports = {
  arguments: ["rule"],
  test: addRule,
};

function addRule(it, expect) {
  it("should throw an error if we try to add a rule to a non-existent field", function() {
    const validator = this.test.validator;
    const field = { id: 1 };
    const rule = {field: field.id, description: "first rule" };

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    expect(validator.addRule.bind(validator, rule)).to.throw(
      errorMessages.fieldNotRegistered
        .replace(":element:", "validator")
        .replace(":id:", field.id)
    );
  });

  it("should add the rule to the specified field", function() {
    const validator = this.test.validator;
    const field = { id: 1 };
    const rule = {field: field.id, description: "first rule" };

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField(field);
    validator.addRule(rule);

    const retrievedField = validator.getField(field.id);

    expect(retrievedField).to.have.property("getRule");
    expect(retrievedField.getRule()).to.deep.equal(rule);
  });
}