module.exports = function reset() {
  if(typeof this.getFields === "function") {
    this.getFields().forEach(function resetField(field) {
      field.reset();
    });
  }
};