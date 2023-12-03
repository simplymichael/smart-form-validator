const errorMessages = require("../error-messages");

const instanceMethodNames = [
  "addField",
  "addFields",
  "addRule",
  "getEffects",
  "getField",
  "getFields",
  "removeRule",
  "toJSON",
  "useEffect",
  "validate",
  "watch",
];

const staticMethodNames = ["getEffects", "useEffect"];

module.exports = { 
  addInstanceMethod,
  addStaticMethod,
};


/**
 * 
 * @param {Function} ctor: a constructor function 
 * @param {String} methodName: the method name to bind to instances of that constructor
 */
function addInstanceMethod(ctor, methodName) {
  if(typeof ctor !== "function") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "ctor")
        .replace(":type:", "(constructor) function")
    );
  }

  if(!instanceMethodNames.includes(methodName)) {
    throw new TypeError(
      errorMessages.unknownType
        .replace(":type:", "method")
        .replace(":typeName:", methodName)
        .replace(":types:", "methods")
        .replace(":allowedTypes:", instanceMethodNames.join("\n"))
    );
  }

  ctor.prototype[methodName] = require(`./${methodName}`);
}

/**
 * 
 * @param {Function} ctor: a constructor function 
 * @param {String} methodName: the method name to bind as a static member to the constructor
 */
function addStaticMethod(ctor, methodName) {
  if(typeof ctor !== "function") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "ctor")
        .replace(":type:", "(constructor) function")
    );
  }
  
  if(!staticMethodNames.includes(methodName)) {
    throw new TypeError(
      errorMessages.unknownType
        .replace(":type:", "method")
        .replace(":typeName:", methodName)
        .replace(":types:", "methods")
        .replace(":allowedTypes:", staticMethodNames.join("\n"))
    );
  }
  
  ctor[methodName] = require(`./${methodName}`);
}