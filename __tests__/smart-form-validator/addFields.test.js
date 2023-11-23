module.exports = {
  arguments: ["fields"],
  test: addFields,
};

function addFields(it, expect) {
  it("should add the specified fields along with their rules, if specified", function() {
    const validator = this.test.validator;

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(0);

    validator.addFields([
      {
        field: {id: 1}, 
        rule: {description: "first rule"}
      }
    ]);

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(1);

    validator.addFields([
      {
        field: {id: 2}, 
        rule: {description: "second rule"}
      },
      {
        field: {id: 3}, 
        rule: {description: "third rule"}
      }
    ]);

    expect(validator.getFields()).to.be.an("array");
    expect(validator.getFields()).to.have.length(3);
  });
}