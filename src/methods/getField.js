const { normalizeId } = require("../helpers");


module.exports = function getField(fieldId) {
  return this.getFields().find(field => normalizeId(field.id) === normalizeId(fieldId)) || null;
};