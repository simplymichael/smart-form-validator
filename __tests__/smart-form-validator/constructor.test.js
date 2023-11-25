const SmartFormValidator = require( "../../src/smart-form-validator");


module.exports = {
  arguments: [],
  test: SmartFormValidatorConstructor,
};

function SmartFormValidatorConstructor(it, expect) {
  it("should be created with a `fields` property and a `form`", function() {
    let sfv = new SmartFormValidator();
    let fields = sfv.fields;
    let form = sfv.form;
    
    expect(fields).to.be.an("array");
    expect(fields).to.deep.equal([]);
    expect(form).to.equal(null);
  });
}