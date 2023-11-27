const SmartField = require( "../../src/smart-field");
const { 
  APP_CLASSNAME, 
  INVALID_FIELD_CLASSNAME, 
  VALID_FIELD_CLASSNAME 
} = require("../setup");

module.exports = {
  arguments: [],
  test: validate,
};

function validate(it, expect) {
  it("should validate the field", function() {
    let result;
    const firstname = "John";
    const firstnameField = $("#firstname-field"); // eslint-disable-line
    const rule = { type: "text", required: true };
    const sf = new SmartField(firstnameField, rule);

    result = sf.validate();
  
    expect(result).to.equal(false);
    expect(firstnameField).to.have.text("");
    expect(firstnameField.className).to.contain(APP_CLASSNAME);
    expect(firstnameField.className).not.to.contain(VALID_FIELD_CLASSNAME);
    expect(firstnameField.className).to.contain(INVALID_FIELD_CLASSNAME);
  
    firstnameField.setAttribute("value", firstname);
  
    result = sf.validate();

    expect(result).to.equal(true);
    expect(firstnameField.value).to.equal(firstname);
    expect(firstnameField.className).to.contain(APP_CLASSNAME);
    expect(firstnameField.className).not.to.contain(INVALID_FIELD_CLASSNAME);
    expect(firstnameField.className).to.contain(VALID_FIELD_CLASSNAME);
  });
}