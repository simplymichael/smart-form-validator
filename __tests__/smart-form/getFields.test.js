module.exports = {
  arguments: [],
  test: getFields,
};

function getFields(it, expect) {
  it("should return the form's fields", function() {
    const validator = this.test.validator;
    const formElements = $("#signup-form").elements; // eslint-disable-line

    expect(validator.getFields()).to.have.length(formElements.length);
  });
}