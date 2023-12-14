const validators = require("../../src/validators");
const errorMessages = require("../../src/error-messages");
const { createListFromArray, getValidatorNames } = require("../../src/helpers");
const { wrapWithDOMFunctionality } = require("../test-helpers");


module.exports = {
  arguments: ["validatorKey", "validatorFn", "[, validatorMeta]"],
  test: addValidator,
};


function addValidator(it, expect) {
  it("should throw an error if the `validatorKey` argument is not a string", function() {
    const context = this.test.context;
    const validatorFn = () => {};

    expect(context.addValidator.bind(context, null, validatorFn)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );

    expect(context.addValidator.bind(context, undefined, validatorFn)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );

    expect(context.addValidator.bind(context, [], validatorFn)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );

    expect(context.addValidator.bind(context, {}, validatorFn)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );
  });

  it("should throw an error if the `validatorKey` argument is an empty string", function() {
    const context = this.test.context;
    const validatorFn = () => {};

    expect(context.addValidator.bind(context, "", validatorFn)).to.throw(
      errorMessages.fieldCannotBeEmpty
        .replace(":field:", "validatorKey")
        .replace(":type:", "string")
    );
  });

  it("should throw an error if the `validatorKey` argument is a default validator name", function() {
    const context = this.test.context;
    const validatorFn = () => {};
    const defaultValidatorKeys = getValidatorNames(validators);

    defaultValidatorKeys.forEach(function assertCannotUseDefaultValidatorName(validatorKey) {
      expect(context.addValidator.bind(context, validatorKey, validatorFn)).to.throw(
        errorMessages.argNamesAreReserved
          .replace(":argNames:", "keys")
          .replace(":argTypes:", "validator keys")
          .replace(":argValues:", createListFromArray(defaultValidatorKeys))
      );
    });
  });

  it("should throw an error if the `validatorKey` has previously been registered", function() {
    const context = this.test.context;
    const validatorFn = () => {};
    const validatorKey = "test-validator";

    expect(context.addValidator.bind(context, validatorKey, validatorFn)).not.to.throw();
    expect(context.addValidator.bind(context, validatorKey, validatorFn)).to.throw(
      errorMessages.objectWithKeyExists
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
    );
  });

  it("should treat the combination of the `validatorKey` and `validatorMeta.namespace` as unique", function() {
    const context = this.test.context;
    const validatorKey = "test-validator";
    const validatorFn = () => {};
    const validatorMeta = { namespace: "test" };
    const validatorMeta2 = { namespace: "" };

    const defaultValidatorKeys = getValidatorNames(validators);

    // Using default validator names, but with a different namespace
    defaultValidatorKeys.forEach(validatorKey => {
      expect(context.addValidator.bind(context, validatorKey, validatorFn, validatorMeta)).not.to.throw();
    });

    // Using addon validator names, but with different namespaces (one with, and one without, a namespace)
    expect(context.addValidator.bind(context, validatorKey, validatorFn, validatorMeta2)).not.to.throw();
    expect(context.addValidator.bind(context, validatorKey, validatorFn, validatorMeta2)).to.throw(
      errorMessages.objectWithKeyExists
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
    );
    expect(context.addValidator.bind(context, validatorKey, validatorFn, validatorMeta)).not.to.throw();
  });

  it("should throw an error if the `validatorFn` argument is not a function", function() {
    const context = this.test.context;
    const validatorKey = "test-validator";

    expect(context.addValidator.bind(context, validatorKey, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );

    expect(context.addValidator.bind(context, validatorKey, undefined)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );

    expect(context.addValidator.bind(context, validatorKey, [])).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );

    expect(context.addValidator.bind(context, validatorKey, {})).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );
  });

  it("should register the validator on the 'context' object", function() {
    const context = this.test.context;
    const validatorKey = "test-validator";
    const validatorFn = () => {};

    expect(context.addValidator.bind(context, validatorKey, validatorFn)).not.to.throw();

    const validators = context.getValidators();

    expect(validators).to.be.an("object");
    expect(Object.keys(validators)).to.have.length(2);
    expect(validators).to.have.property("default");
    expect(validators).to.have.property("addon");
    expect(validators.default).to.be.an("object");
    expect(validators.addon).to.be.an("object");
    expect(Object.keys(validators.addon)).to.have.length(1);
    expect(Object.keys(validators.addon)[0]).to.equal(validatorKey);
    expect(Object.values(validators.addon)[0]).to.deep.equal(validatorFn);
  });

  it("should register the validator on each field of the 'context' object, if any", function() {
    const context = this.test.context;
    const submitBtn = wrapWithDOMFunctionality({ type: "submit" });
    const validatorKey = "test-validator";
    const validatorFn = () => {};

    context.addField({ id: "firstname-field" }, { fieldId: "firstname-field", required: true });
    context.addField(submitBtn);

    expect(context.addValidator.bind(context, validatorKey, validatorFn)).not.to.throw();

    const validators = context.getValidators();

    expect(validators).to.be.an("object");
    expect(Object.keys(validators)).to.have.length(2);
    expect(validators).to.have.property("default");
    expect(validators).to.have.property("addon");
    expect(validators.default).to.be.an("object");
    expect(validators.addon).to.be.an("object");
    expect(Object.keys(validators.addon)).to.have.length(1);
    expect(Object.keys(validators.addon)[0]).to.equal(validatorKey);
    expect(Object.values(validators.addon)[0]).to.deep.equal(validatorFn);

    context.getFields().forEach(function validateFieldHasValidatorRegistered(field) {
      expect(field.hasValidator(validatorKey)).to.equal(true);
    });
  });
}