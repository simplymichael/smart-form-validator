const { VALID_FIELD_CLASSNAME, INVALID_FIELD_CLASSNAME } = require("../../helpers");

module.exports = {
  name: "addBottomBorder",
  meta: {},
  valid: handleValid,
  invalid: handleInvalid,
};

function handleValid(field) {
  field.classList.remove(INVALID_FIELD_CLASSNAME);
  field.classList.add(VALID_FIELD_CLASSNAME);
}
  
function handleInvalid(field) {
  field.classList.remove(VALID_FIELD_CLASSNAME);
  field.classList.add(INVALID_FIELD_CLASSNAME);
}