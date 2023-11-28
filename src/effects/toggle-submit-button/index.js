const { APP_CLASSNAME, DISABLED_FIELD_CLASSNAME } = require("../../helpers");


module.exports = {
  name: "toggleSubmitButton",
  meta: {},
  valid: handleValid,
  invalid: handleInvalid,
};


function handleValid(field) {
  const submitBtn = getSubmitBtn(field);

  if(!submitBtn) {
    return;
  }

  submitBtn.removeAttribute("disabled");
  submitBtn.classList.remove(APP_CLASSNAME);
  submitBtn.classList.remove(DISABLED_FIELD_CLASSNAME);
}
  
function handleInvalid(field) {
  const submitBtn = getSubmitBtn(field);

  if(!submitBtn) {
    return;
  }

  submitBtn.setAttribute("disabled", true);
  submitBtn.classList.add(APP_CLASSNAME);
  submitBtn.classList.add(DISABLED_FIELD_CLASSNAME);
}

function getSubmitBtn(input) {
  let submitBtn;
  const parent = input.parentNode;
      
  submitBtn = parent?.querySelector("[type=\"submit\"]");
  submitBtn = submitBtn || Array.from(parent?.querySelectorAll("button"))?.pop();

  return submitBtn;
}