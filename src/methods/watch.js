const errorMessages = require("../error-messages");


/**
 * Listen for input changes on a form's input members
 * and invoke the handleInputChange for each input element in the form
 * @param {Function} callback: A validation callback, 
 *   the function will be invoked for each input field validated and 
 *   will receive the input field element as the first argument,
 *   and a boolean indicating the validation result as the second argument.
 *   On completion of validation (when every element has been validated), 
 *   the function will be invoked with the form element (if any), 
 *   and the result of the entire validation, 
 *   that is, whether all fields are valid (true) or not (false).
 * @return {Object} with a `valid()` method. The method returns:
 *   true if all fields are valid according to supplied rules, false otherwise.
 */
module.exports = function validateFormFields(callback) {
  let formValid = false;
  const form = this.form;
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
  const validationCallback = getValidationCallback();
  
  inputFields.forEach(function observeField(field) {
    const input = field.getElement();
  
    input.addEventListener(getListenerEvent(input), getChangeProcessor(field, input));
  });
  
  return {
    valid: () => formValid,
  };

  /**
   * @param {Object} field: SmartField instance
   * @param {Object} input: the underlying HTML Element of the SmartField instance 
   * @returns {Function} an event listener function
   */
  function getChangeProcessor(field, input) {
    return function processInputChange() {
      const valid = field.validate();
      const validationState = validationCallback(field, valid, rules);

      formValid = validationState.formValid;

      if(typeof callback === "function") {
        callback(input, valid);

        if(validationState.allFieldsValidated) {
          callback(form, formValid);
        }
      }

      applyEffects(formValid, effectFns, submitButton);
    };
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

function isSubmitButton(smartField) {
  return smartField.role === "submit-button";
}

/**
 * Get the event we should listen for on an element.
 * @param {Object} input: HTML (input) element
 * @return {Object} the event to listen for on the element
 */
function getListenerEvent(input) {
  let targetEvent;

  switch(input.type) {
  case "checkbox" : targetEvent = "click"; break;
  case "email"    :
  case "password" : 
  case "text"     : 
  default         : targetEvent = "input"; break;
  }

  return targetEvent;
}

/**
 * @param void 
 * @returns function. 
 * The returned function takes and returns the following parameters and return value: 
 *    @param {Object} field: SmartField instance
 *    @param {Boolean} valid: whether the current field passed validation or not
 *    @param {Array} rules: Array of the all the rules for all the fields being validated, not just for the current field.
 *    @returns {Object}
 */
function getValidationCallback() {
  let validatedFields = {};

  return function validationCallback(field, valid, rules) {
    let formValid = false;
    let allFieldsValidated = false;

    validatedFields[field.id] = validatedFields[field.id] || {};
    validatedFields[field.id].valid = valid;
  
    if(Object.keys(validatedFields).length === rules.length) {
      allFieldsValidated = true;
      formValid = Object.values(validatedFields).every(field => field.valid);
    }
  
    return { formValid, allFieldsValidated };
  };
}
