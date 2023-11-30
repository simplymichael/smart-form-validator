const errorMessages = require("../error-messages");


/**
 * Listen for input changes on a form's input members
 * and invoke the handleInputChange for each input element in the form
 * @param {Function} callback: A validation callback, 
 *   the function will be invoked for each input field validated and 
 *   will receive the input field element as the first argument,
 *   and a boolean indicating the validation result as the second argument.
 * @return {Object} with a valid() method. The method returns:
 *   true if all fields are valid according to supplied rules, false otherwise.
 */
module.exports = function validateFormFields(callback) {
  let formValid = false;
  const validatedFields = {};
  const fields = this.getFields();
  const inputFields = fields.filter(f => !(isSubmitButton(f)));
  const submitButton = fields.find(isSubmitButton)?.getElement();
  const rules = inputFields.map(field => Boolean(field.getRule()));

  const classEffects = this.constructor.getEffects(); // SmartForm and SmartFormValidator are the constructors
  const instanceEffects = this.getEffects();
  const effects = Object.assign({}, 
    classEffects.default, classEffects.addon, 
    instanceEffects.default, instanceEffects.addon
  );
  const effectFns = Object.values(effects);
  
  inputFields.forEach(field => {
    const input = field.getElement();
    let targetEvent;
  
    switch(input.type) {
    case "checkbox" : targetEvent = "click"; break;
    case "email"    :
    case "password" : 
    case "text"     : 
    default         : targetEvent = "input"; break;
    }
  
    input.addEventListener(targetEvent, () => {
      const valid = field.validate();
      validationCallback(field, valid);
      if(typeof callback === "function") {
        callback(field, valid);
      }
    });
  });
  
  return {
    valid: () => formValid,
  };

  function isSubmitButton(field) {
    return field.role === "submit-button";
  }
  
  function validationCallback(field, valid) {
    validatedFields[field.id] = validatedFields[field.id] || {};
    validatedFields[field.id].valid = valid;
  
    if(Object.keys(validatedFields).length === rules.length) {
      formValid = Object.values(validatedFields).every(field => field.valid);
    }

    applyEffects(formValid, effectFns, submitButton);
  }
};

// Helpers
function applyEffects(validationPassed, effects, submitButton) {
  if(effects.length === 0) {
    throw new TypeError(errorMessages.noEffectsActive);
  }

  effects.forEach(({ valid, invalid }) => {
    if(validationPassed) {
      valid(submitButton);
    } else {
      invalid(submitButton);
    }
  });
}