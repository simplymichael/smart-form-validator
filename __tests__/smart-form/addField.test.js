module.exports = {
  arguments: ["input", "[, rule]"],
  test: addField,
};

function addField(it, expect) {
  it("should fail if we try to add a field that is not present in the form", function() {
    const validator = this.test.validator;
    const formElements = $("#signup-form").elements; // eslint-disable-line

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(formElements.length);

    validator.addField({ id: 1}, {fieldId: 1, description: "first rule" });

    expect(validator.getFields()).to.have.length(formElements.length);
  });
}