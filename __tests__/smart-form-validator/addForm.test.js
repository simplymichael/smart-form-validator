const SmartForm = require("../../src/smart-form");

module.exports = {
  arguments: ["form", "[, rules]"],
  test: addForm,
};

function addForm(it, expect) {
  it("should return a SmartForm instance", function() {
    const validator = this.test.validator;


    const f = validator.addForm({ id: 1}, {description: "first rule" });

    expect(f).to.be.an.instanceof(SmartForm);
  });
}