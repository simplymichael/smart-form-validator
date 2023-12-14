const errorMessages = require("../error-messages");
const { getValidatorNames, preValidatorRegistrationCheck } = require("../helpers");
const defaultValidators = require("../validators");

const defaultValidatorKeys = getValidatorNames(defaultValidators); //Object.keys(defaultValidators);


module.exports = function addValidator(validatorKey, validatorFn, validatorMeta) {
  this.validators = this.validators || {};
  
  validatorKey = preValidatorRegistrationCheck(validatorKey, validatorFn, validatorMeta, defaultValidatorKeys);
  
  if(this.validators[validatorKey]) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
    );
  }
  
  this.validators[validatorKey] = validatorFn;
  
  // Add the effect to the elements attached to the instance.
  if(typeof this.getFields === "function") {
    this.getFields().forEach(field => {
      if(!(field.hasValidator(validatorKey))) {
        field.addValidator(validatorKey, validatorFn, validatorMeta);
      }
    });
  }
};
