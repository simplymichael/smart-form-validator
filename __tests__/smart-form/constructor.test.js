const errorMessages = require("../../src/error-messages");
const SmartField = require("../../src/smart-field");
const SmartForm = require( "../../src/smart-form");


module.exports = {
  arguments: ["form", "[, rules]"],
  test: SmartFormConstructor,
};

function SmartFormConstructor(it, expect) {
  it("should throw an error if the `form` argument is not passed", function() {
    // Pass the function that throws - along with any arguments required for it to throw - to `expect`, 
    // and `expect` will invoke it with the arguments.
    // See: https://stackoverflow.com/a/21587239/1743192
    // For a constructor, wrap it within a function.
    // See: https://stackoverflow.com/a/31009778/1743192
    expect(() => new SmartForm()).to.throw(
      errorMessages.htmlElementExpected
        .replace(":param:", "form")
        .replace(":elementType:", "form")
    );
  });

  it("should be created with a `form` property and a `fields` property", function() {
    const formId = "signup-form";
    let sf = new SmartForm(formId);
    
    
    expect(sf).to.be.an("object");
    expect(sf).to.have.property("form");
    expect(sf).to.have.property("fields");
    expect(sf.fields).to.be.an("array");
    expect(sf.fields.length).to.equal($(`#${formId}`).elements.length); // eslint-disable-line
    expect(sf.form).to.have.property("id", formId);

    sf.fields.forEach(field => expect(field).to.be.an.instanceof(SmartField));
  });
}