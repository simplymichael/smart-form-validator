const { isSubmitBtn } = require("../helpers");


/**
 * @returns {Boolean}: the overall result of the entire validation
 */
module.exports = function validate() {
  const fields = this.getFields();
  const targetFields = fields.filter(function filterOutSubmitButton(field) {
    return !isSubmitBtn(field.getElement());
  });

  const validated = targetFields.map(function validateField(field) {
    return field.validate();
  });
  
  return validated.every(function fieldPassedValidation(passed) {
    return Boolean(passed);
  });
};