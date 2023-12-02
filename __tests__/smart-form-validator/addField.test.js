const errorMessages = require("../../src/error-messages");


module.exports = {
  arguments: ["input", "[, rule]"],
  test: addField,
};

function addField(it, expect) {
  it("should throw an error if we try to add a non-object as field", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(validator.addField.bind(validator, 12345)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(validator.addField.bind(validator, "newField")).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(validator.addField.bind(validator, true)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(validator.addField.bind(validator, new Array(5))).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );

    expect(validator.addField.bind(validator, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "input")
        .replace(":type:", "object")
    );
  });

  it("should throw an error if the element's id is neither a string nor a number", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(validator.addField.bind(validator, { id: null })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );

    expect(validator.addField.bind(validator, { id: undefined })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );

    expect(validator.addField.bind(validator, { id: new Array() })).to.throw(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );
  });

  it("should add the specified field along with its rule, if specified", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField({ id: 1}, { fieldId: 1, required: true });

    expect(validator.getFields()).to.have.length(1);
  });

  it("should just add the rule to the field if the field already exists", function() {
    const validator = this.test.validator;
    const fieldId = "firstname-field";

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField({ id: fieldId }, { fieldId, required: true });

    expect(validator.getFields()).to.have.length(1);
    expect(validator.getField(fieldId).getRule()).to.have.property("required", true);
    expect(validator.getField(fieldId).getRule()).not.to.have.property("type");

    validator.addField({ id: fieldId }, { fieldId, type: "ascii" });
    expect(validator.getFields()).to.have.length(1);
    expect(validator.getField(fieldId).getRule()).to.have.property("required", true);
    expect(validator.getField(fieldId).getRule()).to.have.property("type", "ascii");
  });
}