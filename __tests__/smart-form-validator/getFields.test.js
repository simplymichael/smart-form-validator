module.exports = {
  arguments: [],
  test: getFields,
};

function getFields(it, expect) {
  it("should return the passed fields", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.have.length(0);
  });
}