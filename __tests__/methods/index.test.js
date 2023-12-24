const errorMessages = require("../../src/error-messages");
const { createListFromArray } = require("../../src/helpers");
const { addStaticMethod, addInstanceMethod } = require("../../src/methods");
const { describe } = require("../setup");


module.exports = {
  arguments: [],
  test: index,
};


function index(it, expect) {
  describe("addStaticMethod(constructor, methodName)", function() {
    const staticMethodNames = ["getEffects", "useEffect"];

    it("should throw an error if the `constructor` argument is not a function", function() {
      expect(addStaticMethod.bind(null, null, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );

      expect(addStaticMethod.bind(null, undefined, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );

      expect(addStaticMethod.bind(null, "constructor", "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );

      expect(addStaticMethod.bind(null, 1234, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );

      expect(addStaticMethod.bind(null, [], "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );

      expect(addStaticMethod.bind(null, {}, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
    });

    it("should throw an error if the `methodName` argument is not a valid static method", function() {
      const SmartFormValidator = function() {};
      const methodName = "addButton";

      expect(addStaticMethod.bind(null, SmartFormValidator, methodName)).to.throw(
        errorMessages.unknownType
          .replace(":type:", "static method")
          .replace(":typeName:", methodName)
          .replace(":types:", "methods")
          .replace(":allowedTypes:", createListFromArray(staticMethodNames))
      );
    });

    it("should bind the method as a static member of the constructor", function() {
      const SmartFormValidator = function() {};

      staticMethodNames.forEach(function assertMethodNameNotInClass(methodName) {
        expect(SmartFormValidator).not.to.have.property(methodName);
      });

      staticMethodNames.forEach(function bindMethodAndAssertPresenceInClass(methodName) {
        expect(addStaticMethod.bind(null, SmartFormValidator, methodName)).not.to.throw();
        expect(SmartFormValidator).to.have.property(methodName);
        expect(SmartFormValidator[methodName]).to.be.a("function");
        expect(new SmartFormValidator()).not.to.have.property(methodName); // assert method not bound to instances
      });
    });
  });

  describe("addInstanceMethod(constructor, methodName)", function() {
    const instanceMethodNames = [
      "addField",
      "addFields",
      "addRule",
      "addValidator",
      "getValidators",
      "getEffects",
      "getField",
      "getFields",
      "removeRule",
      "reset",
      "toJSON",
      "useEffect",
      "validate",
      "watch",
    ];

    it("should throw an error if the `constructor` argument is not a function", function() {
      expect(addInstanceMethod.bind(null, null, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
  
      expect(addInstanceMethod.bind(null, undefined, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
  
      expect(addInstanceMethod.bind(null, "constructor", "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
  
      expect(addInstanceMethod.bind(null, 1234, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
  
      expect(addInstanceMethod.bind(null, [], "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
  
      expect(addInstanceMethod.bind(null, {}, "addField")).to.throw(
        errorMessages.functionParamExpectsType
          .replace(":param:", "ctor")
          .replace(":type:", "(constructor) function")
      );
    });
  
    it("should throw an error if the `methodName` argument is not a valid instance method", function() {
      const SmartFormValidator = function() {};
      const methodName = "addElement";
  
      expect(addInstanceMethod.bind(null, SmartFormValidator, methodName)).to.throw(
        errorMessages.unknownType
          .replace(":type:", "instance method")
          .replace(":typeName:", methodName)
          .replace(":types:", "methods")
          .replace(":allowedTypes:", createListFromArray(instanceMethodNames))
      );
    });
  
    it("should bind the method to instances of the constructor", function() {
      const SmartFormValidator = function() {};
  
      instanceMethodNames.forEach(function assertMethodNameNotInClassInstance(methodName) {
        expect(new SmartFormValidator()).not.to.have.property(methodName);
      });
  
      instanceMethodNames.forEach(function bindMethodAndAssertPresenceInClassInstances(methodName) {
        expect(addInstanceMethod.bind(null, SmartFormValidator, methodName)).not.to.throw();
        expect(new SmartFormValidator()).to.have.property(methodName);
        expect((new SmartFormValidator())[methodName]).to.be.a("function");
        expect(SmartFormValidator).not.to.have.property(methodName); // assert method not bound to class
      });
    });
  });
}