const { normalizeId } = require("../helpers");


module.exports = function getField(fieldId) {
  return this.toJSON().find(field => field.id === normalizeId(fieldId)) || null;
};