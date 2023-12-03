const errorMessages = require("../../src/error-messages");

module.exports = {
  arguments: ["rule"],
  test: addRule,
};

function addRule(it, expect) {
  it("should throw an error if we try to add a rule to a non-existent field", function() {
    const context = this.test.context;
    const field = { id: 1 };
    const rule = { field: field.id, required: true };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    expect(context.addRule.bind(context, rule)).to.throw(
      errorMessages.fieldNotRegistered
        .replace(":element:", "validator")
        .replace(":id:", field.id)
    );
  });

  it("should throw an error if we try to add a non-object as rule to an existing field", function() {
    const context = this.test.context;
    const field = { id: 1 };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(field);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(context.addRule.bind(context, 12345)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(context.addRule.bind(context, "stringField")).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(context.addRule.bind(context, true)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(context.addRule.bind(context, new Array(5))).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );

    expect(context.addRule.bind(context, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );
  });

  it("should throw an error if the `rule` object has no `field` property", function() {
    const context = this.test.context;
    const field = { id: "firstname-field" };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(field);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(context.addRule.bind(context, { name: "test-rule" })).to.throw(
      errorMessages.objectMustHaveProperty
        .replace(":param:", "rule")
        .replace(":prop:", "field")
    );
  });

  it("should add the rule to the specified field", function() {
    const context = this.test.context;
    const field = { id: 1 };
    const rule = { field: field.id, required: true };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(field);
    context.addRule(rule);

    const retrievedField = context.getField(field.id);

    expect(retrievedField).to.have.property("getRule");
    expect(retrievedField.getRule()).to.deep.equal(rule);
  });
}