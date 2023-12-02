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

  it("should throw an error if we try to add a non-object as rule to an existing field", function() {
    const validator = this.test.validator;
    const field = { id: 1 };

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField(field);

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(1);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(validator.addRule.bind(validator, 12345)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(validator.addRule.bind(validator, "newField")).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(validator.addRule.bind(validator, true)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(validator.addRule.bind(validator, new Array(5))).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(validator.addRule.bind(validator, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );
  });

  it("should throw an error if the `rule` object has not `field` property", function() {
    const validator = this.test.validator;
    const field = { id: "firstname-field" };

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField(field);

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(1);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(validator.addRule.bind(validator, { name: "test-rule" })).to.throw(
      errorMessages.objectMustHaveProperty
        .replace(":param:", "rule")
        .replace(":prop:", "field")
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