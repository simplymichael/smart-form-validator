/**
 * @returns {Boolean}: the overall result of the entire validation
 */
module.exports = function validate() {
  const validated = this.toJSON().map(field => field.validate());
  
  return validated.every(passed => Boolean(passed));
};