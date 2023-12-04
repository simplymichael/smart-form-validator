const effects = require("../../src/effects");
const errorMessages = require("../../src/error-messages");
const { getEffectNames } = require("../../src/helpers");


module.exports = {
  arguments: ["effect"],
  test: useEffect,
};


function useEffect(it, expect) {
  it("should throw an error if the `effect` parameter is not an object", function() {
    const context = this.test.context;

    expect(context.useEffect.bind(context, null)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );

    expect(context.useEffect.bind(context, undefined)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );

    expect(context.useEffect.bind(context, "stringEffect")).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );

    expect(context.useEffect.bind(context, 12345)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );

    expect(context.useEffect.bind(context, new Array(7))).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );

    expect(context.useEffect.bind(context, [1, "string", {}])).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );
  });

  it("should throw an error if the `name` property of the `effect` object is not set", function() {
    const context = this.test.context;
    const effect = { 
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "custom",
      }
    };

    expect(context.useEffect.bind(context, effect)).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );
  });

  it("should throw an error if the `name` property of the `effect` object is not a string", function() {
    const context = this.test.context;
    const effect = { 
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "custom",
      }
    };

    expect(context.useEffect.bind(context, { ...effect, name: null })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: undefined })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: [] })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: {} })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );
  });

  it("should throw an error if the `name` property of the `effect` object is an empty string", function() {
    const context = this.test.context;
    const effect = { 
      name: " ",
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "custom",
      }
    };

    expect(context.useEffect.bind(context, effect)).to.throw(
      errorMessages.fieldCannotBeEmpty
        .replace(":field:", "effect.name")
        .replace(":type:", "string")
    );
  });

  it("should throw an error if the effect name is a built-in effect name", function() {
    const context = this.test.context;
    const effect = { 
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "",
      }
    };

    const defaultEffectNames = getEffectNames(effects);

    defaultEffectNames.forEach(effectName => {
      expect(context.useEffect.bind(context, { ...effect, name: effectName })).to.throw(
        errorMessages.argNamesAreReserved
          .replace(":argNames:", "names")
          .replace(":argTypes:", "effect names")
          .replace(":argValues:", defaultEffectNames.join("\n"))
      );
    });
  });

  it("should throw an error if the effect name has previously been registered", function() {
    const context = this.test.context;
    const effect = { 
      name: "test-effect",
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "",
      }
    };

    expect(context.useEffect.bind(context, effect)).not.to.throw();
    expect(context.useEffect.bind(context, effect)).to.throw(
      errorMessages.objectWithKeyExists
        .replace(":object:", "An effect")
        .replace(":key:", effect.name)
    );
  });

  it("should treat the combination of the effect name and namespace as unique", function() {
    const context = this.test.context;
    const effect = { 
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "test",
      }
    };

    const defaultEffectNames = getEffectNames(effects);

    defaultEffectNames.forEach(effectName => {
      expect(context.useEffect.bind(context, { ...effect, name: effectName })).not.to.throw();
    });
  });
}