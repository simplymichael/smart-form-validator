module.exports = {
  arguments: ["input", "[, rule]"],
  test: addField,
};

function addField(it, expect) {
  it("should add the specified field along with its rule, if specified", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addField({ id: 1}, {fieldId: 1, description: "first rule" });

    expect(validator.getFields()).to.have.length(1);
  });
}