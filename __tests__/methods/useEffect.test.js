const effects = require("../../src/effects");
const errorMessages = require("../../src/error-messages");
const { getEffectNames } = require("../../src/helpers");
const { wrapWithDOMFunctionality } = require("../test-helpers");


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
        .replace(":type:", "a string")
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
        .replace(":type:", "a string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: undefined })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "a string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: [] })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "a string")
    );

    expect(context.useEffect.bind(context, { ...effect, name: {} })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "a string")
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

    const effect2 = { 
      name: "test-effect",
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "",
      }
    };

    const effect2Namespaced = { 
      ...effect2, 
      meta: { 
        ...effect2.meta, 
        namespace: "test" 
      }
    };

    const defaultEffectNames = getEffectNames(effects);

    // Using default effect names, but with a different namespace
    defaultEffectNames.forEach(effectName => {
      expect(context.useEffect.bind(context, { ...effect, name: effectName })).not.to.throw();
    });

    // Using addon effect name, but with different namespaces (one with, and one without, a namespace)
    expect(context.useEffect.bind(context, effect2)).not.to.throw();
    expect(context.useEffect.bind(context, effect2)).to.throw(
      errorMessages.objectWithKeyExists
        .replace(":object:", "An effect")
        .replace(":key:", effect2.name)
    );
    expect(context.useEffect.bind(context, effect2Namespaced)).not.to.throw();
  });

  it("should throw an error if the `valid` property of the `effect` object is not a function", function() {
    const context = this.test.context;
    const effect = { 
      name: "test-effect",
      init: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "test",
      }
    };

    expect(context.useEffect.bind(context, { ...effect, valid: null })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, valid: undefined })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, valid: [] })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, valid: {} })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "a function")
    );
  });

  it("should throw an error if the `invalid` property of the `effect` object is not a function", function() {
    const context = this.test.context;
    const effect = { 
      name: "test-effect",
      init: () => {},
      valid: () => {}, 
      meta: {
        namespace: "test",
      }
    };

    expect(context.useEffect.bind(context, { ...effect, invalid: null })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, invalid: undefined })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, invalid: [] })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "a function")
    );

    expect(context.useEffect.bind(context, { ...effect, invalid: {} })).to.throw(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "a function")
    );
  });

  it("should register the effect on the 'context' object", function() {
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

    const effects = context.getEffects();
    const { name: _, ...registeredEffect } = effect; // eslint-disable-line

    expect(effects).to.be.an("object");
    expect(Object.keys(effects)).to.have.length(2);
    expect(effects).to.have.property("default");
    expect(effects).to.have.property("addon");
    expect(effects.default).to.be.an("object");
    expect(effects.addon).to.be.an("object");
    expect(Object.keys(effects.addon)).to.have.length(1);
    expect(Object.keys(effects.addon)[0]).to.equal(effect.name);
    expect(Object.values(effects.addon)[0]).to.deep.equal(registeredEffect);
  });

  it("should register the effect on each field of the 'context' object, if any", function() {
    const context = this.test.context;
    const submitBtn = wrapWithDOMFunctionality({ type: "submit" });

    const effect = { 
      name: "test-effect",
      init: () => {},
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "",
      }
    };

    context.addField({ id: "firstname-field" }, { fieldId: "firstname-field", required: true });
    context.addField(submitBtn);

    expect(context.useEffect.bind(context, effect)).not.to.throw();

    const effects = context.getEffects();
    const { name: _, ...registeredEffect } = effect; // eslint-disable-line

    expect(effects).to.be.an("object");
    expect(Object.keys(effects)).to.have.length(2);
    expect(effects).to.have.property("default");
    expect(effects).to.have.property("addon");
    expect(effects.default).to.be.an("object");
    expect(effects.addon).to.be.an("object");
    expect(Object.keys(effects.addon)).to.have.length(1);
    expect(Object.keys(effects.addon)[0]).to.equal(effect.name);
    expect(Object.values(effects.addon)[0]).to.deep.equal(registeredEffect);

    context.getFields().forEach(function validateFieldHasEffectRegistered(field) {
      expect(field.usesEffect(effect.name)).to.equal(true);
    });
  });

  it("the `effect.init` function is optional", function() {
    const context = this.test.context;
    const effect = { 
      name: "test-effect",
      valid: () => {},
      invalid: () => {}, 
      meta: {
        namespace: "",
      }
    };

    expect(context.useEffect.bind(context, effect)).not.to.throw();

    const effects = context.getEffects();
    const { name: _, ...registeredEffect } = effect; // eslint-disable-line

    expect(effects).to.be.an("object");
    expect(Object.keys(effects)).to.have.length(2);
    expect(effects).to.have.property("default");
    expect(effects).to.have.property("addon");
    expect(effects.default).to.be.an("object");
    expect(effects.addon).to.be.an("object");
    expect(Object.keys(effects.addon)).to.have.length(1);
    expect(Object.keys(effects.addon)[0]).to.equal(effect.name);
    expect(Object.values(effects.addon)[0]).to.deep.equal({ ...registeredEffect, init: undefined });
  });
}