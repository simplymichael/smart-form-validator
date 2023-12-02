module.exports = {
  arguments: ["fieldId", "[, ruleKey]"],
  test: removeRule,
};

function removeRule(it, expect) {
  it("should delete the rule on the specified field", function() {
    const validator = this.test.validator;
    const field = { id: "name-field" };
    const formElements = $("#signup-form").elements; // eslint-disable-line
    const rule = {field: field.id, description: "first rule updated" };

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(formElements.length);

    validator.addRule(rule);
    const retrievedField = validator.getField(field.id);

    expect(retrievedField).to.have.property("getRule");
    expect(retrievedField.getRule()).to.deep.equal(rule);

    validator.removeRule(field.id);

    expect(retrievedField.getRule()).to.equal(null);
  });

  it("should delete only rule with specified key", function() {

  });
}