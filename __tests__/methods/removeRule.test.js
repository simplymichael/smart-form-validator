module.exports = {
  arguments: ["fieldId", "[, ruleKey]"],
  test: removeRule,
};

function removeRule(it, expect) {
  it("should delete the rule on the specified field", function() {
    const context = this.test.context;
    const field = { id: 1 };
    const rule = { field: field.id, required: true };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(field);
    context.addRule(rule);
    const retrievedField = context.getField(field.id);

    expect(retrievedField).to.have.property("getRule");
    expect(retrievedField.getRule()).to.deep.equal(rule);

    context.removeRule(field.id);

    expect(retrievedField.getRule()).to.equal(null);
  });

  it("should delete only rule with specified key", function() {
    const context = this.test.context;
    const field = { id: 1 };
    const rule = { field: field.id, required: true, type: "ascii", length: 25 };

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addField(field);
    context.addRule(rule);
    
    const retrievedField = context.getField(field.id);

    expect(retrievedField).to.have.property("getRule");
    expect(retrievedField.getRule()).to.have.property("required", true);
    expect(retrievedField.getRule()).to.have.property("type", "ascii");
    expect(retrievedField.getRule()).to.have.property("length");

    context.removeRule(field.id, "length");

    expect(retrievedField.getRule()).to.have.property("required", true);
    expect(retrievedField.getRule()).to.have.property("type", "ascii");
    expect(retrievedField.getRule()).not.to.have.property("length");
  });
}