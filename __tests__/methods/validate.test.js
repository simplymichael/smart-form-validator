module.exports = {
  arguments: [],
  test: validate,
};


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


function validate(it, expect) { // eslint-disable-line
  it("should return false if one or more fields fail validation", function() {
    const context = this.test.context;

    context.addField(firstnameField, firstnameRules);
    context.addField(lastnameField, lastnameRules);
    context.addField(emailField, emailRules);
    context.addField(phoneNumberField, phoneNumberRules);

    expect(context.validate()).to.equal(false);


    // Firstname field's minimum length is 3, validation should fail
    firstnameField.setValue("Jo"); 
    lastnameField.setValue("Doe");
    emailField.setValue("john-doe@doe-family.com");
    phoneNumberField.setValue(1234567);

    expect(context.validate()).to.equal(false);


    // Lastname field's minimum length is 3, validation should fail
    firstnameField.setValue("Jane");
    lastnameField.setValue("Do"); 
    emailField.setValue("john-doe@doe-family.com");
    phoneNumberField.setValue(1234567);

    expect(context.validate()).to.equal(false);


    // invalid email format, validation should fail
    firstnameField.setValue("John");
    lastnameField.setValue("Doe");
    emailField.setValue("john-doe"); 
    phoneNumberField.setValue(1234567);

    expect(context.validate()).to.equal(false);


    // Phone number should be at least 7 numbers, validation should fail
    firstnameField.setValue("Jane");
    lastnameField.setValue("Doe");
    emailField.setValue("john-doe@doe-family.com"); 
    phoneNumberField.setValue(123456);

    expect(context.validate()).to.equal(false);
  });

  it("should return true if all fields pass validation", function() {
    const context = this.test.context;

    context.addField(firstnameField, firstnameRules);
    context.addField(lastnameField, lastnameRules);
    context.addField(emailField, emailRules);
    context.addField(phoneNumberField, phoneNumberRules);

    expect(context.validate()).to.equal(false);

    firstnameField.setValue("John");
    lastnameField.setValue("Doe");
    emailField.setValue("john-doe@doe-family.com");
    phoneNumberField.setValue(1234567);

    expect(context.validate()).to.equal(true);
  });
}


// Helpers
function wrapWithDOMFunctionality(obj) {
  const newObj = Object.create({ classes: [] });
  const syntheticProperties = { 
    setAttribute: (k, v) => this[k] = v, 
    classList: {
      add: (className) => newObj.classes.push(className),
      remove: (className) => newObj.classes = newObj.classes.filter(c => c !== className)
    },
  };

  return Object.assign({}, obj, newObj, syntheticProperties);
}