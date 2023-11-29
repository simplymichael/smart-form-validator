const { is, APP_CLASSNAME, DISABLED_FIELD_CLASSNAME } = require("../../helpers");


module.exports = {
  name: "toggleSubmitButton",
  meta: {},
  init,
  valid: handleValid,
  invalid: handleInvalid,
};


function init(field) {
  // Initially disable the submit button
  canSubmitForm(false, field);
}

function handleValid(field) {
  canSubmitForm(true, field);
}
  
function handleInvalid(field) {
  canSubmitForm(false, field);
}


// Helper methods
function canSubmitForm(validationPassed, input) {
  try {
    if(!(is.object(input)) || input.type !== "submit") {
      return;
    }

    const submitBtn = input;

    if(!submitBtn) {
      return;
    }

    if(validationPassed) {
      submitBtn.removeAttribute("disabled");
      submitBtn.classList.remove(APP_CLASSNAME);
      submitBtn.classList.remove(DISABLED_FIELD_CLASSNAME);
    } else {
      submitBtn.setAttribute("disabled", true);
      submitBtn.classList.add(APP_CLASSNAME);
      submitBtn.classList.add(DISABLED_FIELD_CLASSNAME);
    }
  } catch(e) {
    console.log("Unable to modify the submit button state: ", e);
  }
}
