const { is } = require("../helpers");


module.exports = {
  isSubmitButton,
};


function isSubmitButton(element) {
  return (
    is.object(element) && (element.type === "submit" || element.role === "submit-button")
  );
}