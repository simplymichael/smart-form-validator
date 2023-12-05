const errorMessages = require("../../src/error-messages");
const { wrapWithDOMFunctionality } = require("../test-helpers");


module.exports = {
  arguments: ["input", "[, rule]"],
  test: addField,
};

function addField(it, expect) {
  it("should throw an error if we try to add a non-object as field", function() {
    const context = this.test.context;

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(context.addField.bind(context, 12345)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(context.addField.bind(context, "newField")).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(context.addField.bind(context, true)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(context.addField.bind(context, new Array(5))).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(context.addField.bind(context, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );
  });

  it("should throw an error if the element's id is neither a string nor a number", function() {
    const context = this.test.context;

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(context.addField.bind(context, { id: null })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );

    expect(context.addField.bind(context, { id: undefined })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );

    expect(context.addField.bind(context, { id: new Array() })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );
  });

  it("should add the specified field if it's id is a number", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ id: 1 });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
  });

  it("should add the specified field if it's id is a string", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ id: "firstname" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
  });

  it("should add the field if it has no `id` property but has a `type` of `submit`", function() {
    const context = this.test.context;
    const submitBtn = wrapWithDOMFunctionality({ type: "submit" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(submitBtn);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
  });

  it("should add the field if it has no `id` property but has a `role` of `submit-button`", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ role: "submit-button" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
  });

  it("should add the field along with its rule, if a `rule` object is specified", function() {
    const context = this.test.context;
    const fieldId = 1;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ id: fieldId }, { fieldId, required: true });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
    expect(context.getField(fieldId)).to.have.property("getRule");
    expect(context.getField(fieldId).getRule).to.be.a("function");
    expect(context.getField(fieldId).getRule()).to.be.an("object");
    expect(context.getField(fieldId).getRule()).to.have.property("required", true);
  });

  it("should not re-add an already existing field", function() {
    const context = this.test.context;
    const fieldId = "lastname";

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ id: fieldId });

    expect(context.getFields()).to.have.length(1);

    context.addField({ id: fieldId });
    expect(context.getFields()).to.have.length(1);
  });

  it("should just add the rule to the field if the field already exists", function() {
    const context = this.test.context;
    const fieldId = "firstname";

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField({ id: fieldId }, { fieldId, required: true });

    expect(context.getFields()).to.have.length(1);
    expect(context.getField(fieldId).getRule()).to.have.property("required", true);
    expect(context.getField(fieldId).getRule()).not.to.have.property("type");

    context.addField({ id: fieldId }, { fieldId, type: "ascii" });
    expect(context.getFields()).to.have.length(1);
    expect(context.getField(fieldId).getRule()).to.have.property("required", true);
    expect(context.getField(fieldId).getRule()).to.have.property("type", "ascii");
  });
}