const { 
  APP_CLASSNAME,  
  SMART_FIELD_CLASSNAME,
  VALID_FIELD_CLASSNAME,
  INVALID_FIELD_CLASSNAME,
} = require("../../src/helpers");
const { wrapWithDOMFunctionality } = require("../test-helpers");

const firstnameField = wrapWithDOMFunctionality({ 
  id: "firstname-field", 
  setValue(val) { this.value = val; },
  getValue() { return this.value; },
});

const lastnameField = wrapWithDOMFunctionality({ 
  id: "lastname-field", 
  setValue(val) { this.value = val; },
  getValue() { return this.value; },
});

const emailField = wrapWithDOMFunctionality({ 
  id: "email-field", 
  setValue(val) { this.value = val; },
  getValue() { return this.value; },
});

const phoneNumberField = wrapWithDOMFunctionality({ 
  id: "phone-field", 
  setValue(val) { this.value = val; },
  getValue() { return this.value; },
});

const firstnameRules = { fieldId: firstnameField.id, type: "ascii", length: { min: 3 } };
const lastnameRules = { fieldId: lastnameField.id, type: "ascii", length: { min: 3 } };
const emailRules = { fieldId: emailField.id, type: "email" };
const phoneNumberRules = { fieldId: phoneNumberField.id, type: "number", length: { min: 7 } };


module.exports = {
  arguments: [],
  test: reset,
};


function reset(it, expect) {
  it("should reset the each field, if any, of the 'context' object", function() {
    const context = this.test.context;

    context.addField(firstnameField, firstnameRules);
    context.addField(lastnameField, lastnameRules);
    context.addField(emailField, emailRules);
    context.addField(phoneNumberField, phoneNumberRules);

    expect(context.validate()).to.equal(false);

    context.getFields().forEach(function validateFieldHasInvalidClassnamesAdded(field) {
      const element = field.getElement();

      expect(element.classList.contains(APP_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(SMART_FIELD_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
    });

    firstnameField.setValue("John");
    lastnameField.setValue("Doe");
    emailField.setValue("john-doe@doe-family.com");
    phoneNumberField.setValue(1234567);

    expect(context.validate()).to.equal(true);

    context.getFields().forEach(function validateFieldHasValidClassnamesAdded(field) {
      const element = field.getElement();

      expect(element.classList.contains(APP_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(SMART_FIELD_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });
    

    expect(context.reset.bind(context)).not.to.throw();

    context.getFields().forEach(function validateFieldHasbeenReset(field) {
      const element = field.getElement();

      // After reset, the field still has the APP_CLASSNAME and SMART_FIELD_CLASSNAME, 
      // as well as its registered effects.
      expect(element.classList.contains(APP_CLASSNAME)).to.equal(true);
      expect(element.classList.contains(SMART_FIELD_CLASSNAME)).to.equal(true);

      // After reset, the field is neither valid nor invalid
      expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
      expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });
  });
}