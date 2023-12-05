const { is, VALID_FIELD_CLASSNAME, INVALID_FIELD_CLASSNAME } = require("../../helpers");
const { isSubmitButton } = require("../effects-helpers");

module.exports = {
  name: "addBottomBorder",
  meta: {},
  valid: handleValid,
  invalid: handleInvalid,
};

function handleValid(field) {
  if(!(is.object(field)) || isSubmitButton(field)) {
    return;
  }

  field.classList.remove(INVALID_FIELD_CLASSNAME);
  field.classList.add(VALID_FIELD_CLASSNAME);
}
  
function handleInvalid(field) {
  if(!(is.object(field)) || isSubmitButton(field)) {
    return;
  }

  field.classList.remove(VALID_FIELD_CLASSNAME);
  field.classList.add(INVALID_FIELD_CLASSNAME);
}