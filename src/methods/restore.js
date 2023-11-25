/**
 * Reset the "error"|"ok" states for the form's input elements.
 */
module.exports = function restoreFields() {
  this.toJSON().forEach(field => field.restore());
};