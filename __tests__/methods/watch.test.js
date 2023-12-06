const { beforeEach } = require("mocha");
const SmartForm = require( "../../src/smart-form");
const SmartFormValidator = require( "../../src/smart-form-validator");
const { sinon } = require("../setup");


module.exports = {
  arguments: [],
  test: watch,
};


function watch(it, expect) { 
  beforeEach(function(done) {
    const formId = "signup-form";
    const form = $(`#${formId}`); // eslint-disable-line
    const formElements = form.elements;

    this.currentTest.formId = formId;
    this.currentTest.form = form;
    this.currentTest.formElements = formElements;

    done();
  });

  it("should watch elements on a SmartForm instance", function() {
    const smartForm = new SmartForm(this.test.form);
    runFormWatchValidations(smartForm, expect);
  });

  it("should watch isolated elements on a SmartFormValidator instance", function() {
    let firstnameFieldValid = false;
    let acceptTermsFieldValid = false;
    let validationCallbackSpy = sinon.spy();

    const nameFieldId = "firstname-field";
    const termsFieldId = "accept-terms-field";
    
    const validator = new SmartFormValidator();
    const resetValidationCallbackSpy = () => validationCallbackSpy = sinon.spy();
    const validationCallback = function validationCallback(element, valid) {
      // The calls to the Sinon spy lets us know if our validation callback was invoked.

      if(element instanceof SmartFormValidator) {
        // every field has been validated, validation is complete
        validationCallbackSpy(element, firstnameFieldValid && acceptTermsFieldValid);
        expect(valid).to.equal(firstnameFieldValid && acceptTermsFieldValid);
        expect(validationState.valid()).to.equal(valid);
      } else {
        validationCallbackSpy(element, valid);

        switch(element.id) {
        case "firstname-field": expect(valid).to.equal(firstnameFieldValid); break;
        case "accept-terms-field": expect(valid).to.equal(acceptTermsFieldValid); break;
        }
      }
    };

    const validationState = (
      validator
        .addField(nameFieldId, { type: "ascii", length: { min: 3, max: 7 } })
        .addField(termsFieldId)
        .addRule({ field: termsFieldId, type: "checkbox", required: true })
        .watch(validationCallback)
    );

    expect(validationState).to.be.an("object");
    expect(validationState).to.have.property("valid");
    expect(validationState.valid).to.be.a("function");

    const firstnameField = $(`#${nameFieldId}`); // eslint-disable-line
    const acceptTermsField = $(`#${termsFieldId}`); // eslint-disable-line

    firstnameField.setAttribute("value", "johndoe");
    acceptTermsField.setAttribute("value", "on");
    acceptTermsField.setAttribute("checked", true);

    firstnameFieldValid = true;
    acceptTermsFieldValid = true;

    firstnameField.dispatchEvent(new Event("input", { bubbles: true }));
    acceptTermsField.dispatchEvent(new Event("click", { bubbles: true }));

    expect(validationCallbackSpy).to.have.been.calledWith(firstnameField, true);
    expect(validationCallbackSpy).to.have.been.calledWith(acceptTermsField, true);
    expect(validationCallbackSpy).to.have.been.calledWith(validator, true);

    acceptTermsField.removeAttribute("checked");
    resetValidationCallbackSpy();

    const acceptTermsData = [
      { value: "off", checked: false, expectation: false },
      { value: "off", checked: true, expectation: false },
      { value: "on", checked: false, expectation: false },
      { value: "on", checked: true, expectation: true },
    ];

    const nameData = [
      { value: "", expectation: false },
      { value: "J", expectation: false }, 
      { value: "Jo", expectation: false }, 
      { value: "Joe", expectation: true },
      { value: "Jane", expectation: true },
      { value: "Joe doe", expectation: true }, // whitespace allowed since type is "ascii"
      { value: "Cynthia", expectation: true },
      { value: "Jane Doe", expectation: false },
    ];

    acceptTermsData.forEach(function acceptCheckboxFieldMeetsExpectation({ value, checked, expectation }) {
      acceptTermsFieldValid = expectation;
      acceptTermsField.setAttribute("value", value);

      // The `checked` attribute is a boolean 
      // attempting to set `true` or `false` on it will result in 
      // the `true` or `false` becoming a string, leading to a boolean evaluation of true.
      if(checked) {
        acceptTermsField.setAttribute("checked", checked);
      } else {
        acceptTermsField.removeAttribute("checked");
      }

      acceptTermsField.dispatchEvent(new Event("click", { bubbles: true }));

      expect(validationCallbackSpy).to.have.been.calledWith(acceptTermsField, expectation);
      resetValidationCallbackSpy();
    });

    nameData.forEach(function assertNameMeetsExpectation({ value, expectation }) {
      firstnameFieldValid = expectation;
      firstnameField.setAttribute("value", value);
      firstnameField.dispatchEvent(new Event("input", { bubbles: true }));

      expect(validationCallbackSpy).to.have.been.calledWith(firstnameField, expectation);
      resetValidationCallbackSpy();
    });
  });

  it("should watch elements on a SmartForm instance obtained via a SmartFormValidator instance", function() {
    const smartForm = new SmartFormValidator().addForm(this.test.form);
    runFormWatchValidations(smartForm, expect);
  });
}


function runFormWatchValidations(smartForm, expect) {
  let formState;
  let nameFieldValid = false; 
  let usernameFieldValid = false;
  let emailFieldValid = false;
  let validationCallbackSpy = sinon.spy();

  const form = smartForm.form;
  const formId = form.id;
  const formElements = form.elements;

  const resetValidationCallbackSpy = () => validationCallbackSpy = sinon.spy();
  const validationCallback = function validationCallback(element, valid) {
    // The calls to the Sinon spy lets us know if our validation callback was invoked.

    if(element.id === formId) {
      // every field has been validated, validation is complete
      validationCallbackSpy(form, nameFieldValid && usernameFieldValid && emailFieldValid);
      expect(valid).to.equal(nameFieldValid && usernameFieldValid && emailFieldValid);
      expect(formState.valid()).to.equal(valid);
    } else {
      validationCallbackSpy(element, valid);

      switch(element.id) {
      case "name-field": expect(valid).to.equal(nameFieldValid); break;
      case "username-field": expect(valid).to.equal(usernameFieldValid); break;
      case "email-field": expect(valid).to.equal(emailFieldValid); break;
      }
    }
  };

  formState = (
    smartForm
      .addRule({ field: "name-field", type: "ascii", length: { min: 3, max: 7 } })
      .addRule({ field: "username-field", type: "alpha", length: { min: 3, max: 7 } })
      .addRule({ field: "email-field", type: "email" })
      .watch(validationCallback)
  );

  expect(formState).to.be.an("object");
  expect(formState).to.have.property("valid");
  expect(formState.valid).to.be.a("function");

  const nameField = $("#name-field"); // eslint-disable-line
  const usernameField = $("#username-field"); // eslint-disable-line
  const emailField = $("#email-field"); // eslint-disable-line

  nameField.setAttribute("value", "John");
  usernameField.setAttribute("value", "johndoe");
  emailField.setAttribute("value", "john@doe-family.com");

  nameFieldValid = true;
  usernameFieldValid = true;
  emailFieldValid = true;

  nameField.dispatchEvent(new Event("input", { bubbles: true }));
  usernameField.dispatchEvent(new Event("input", { bubbles: true }));
  emailField.dispatchEvent(new Event("input", { bubbles: true }));

  expect(validationCallbackSpy).to.have.been.calledWith(nameField, true);
  expect(validationCallbackSpy).to.have.been.calledWith(usernameField, true);
  expect(validationCallbackSpy).to.have.been.calledWith(emailField, true);
  expect(validationCallbackSpy).to.have.been.calledWith(form, true);

  resetValidationCallbackSpy();

  Array.from(formElements).forEach(function assertWatchingElement(element) {
    if(element.id === "name-field") {
      const nameData = [
        { value: "", expectation: false },
        { value: "J", expectation: false }, 
        { value: "Jo", expectation: false }, 
        { value: "Joe", expectation: true },
        { value: "Jane", expectation: true },
        { value: "Joe doe", expectation: true }, // whitespace allowed since type is "ascii"
        { value: "Cynthia", expectation: true },
        { value: "Jane Doe", expectation: false },
      ];

      nameData.forEach(function assertNameMeetsExpectation({ value, expectation }) {
        nameFieldValid = expectation;
        element.setAttribute("value", value);
        element.dispatchEvent(new Event("input", { bubbles: true }));

        expect(validationCallbackSpy).to.have.been.calledWith(element, expectation);
        resetValidationCallbackSpy();
      });
    } else if(element.id === "username-field") {
      const usernameData = [
        { value: "", expectation: false },
        { value: "J", expectation: false }, 
        { value: "Jo", expectation: false }, 
        { value: "Joe", expectation: true },
        { value: "Jane", expectation: true },
        { value: "Joe doe", expectation: false }, // whitespace not allowed: `type` is "alpha" and no `allowWhitespace`
        { value: "Cynthia", expectation: true },
        { value: "Jane Doe", expectation: false },
        { value: "gregory", expectation: true }, 
        { value: "GREGORY", expectation: true },
      ];

      usernameData.forEach(function assertUsernameMeetsExpectation({ value, expectation }) {
        usernameFieldValid = expectation;
        element.setAttribute("value", value);
        element.dispatchEvent(new Event("input", { bubbles: true }));

        expect(validationCallbackSpy).to.have.been.calledWith(element, expectation);
        resetValidationCallbackSpy();
      });
    } else if(element.id === "email-field") {
      const emailData = [
        { value: "", expectation: false },
        { value: "jane", expectation: false }, 
        { value: "jane@doe-family", expectation: false }, 
        { value: "jane@doe-family.com", expectation: true },
      ];

      emailData.forEach(function assertEmailMeetsExpectation({ value, expectation }) {
        emailFieldValid = expectation;
        element.setAttribute("value", value);
        element.dispatchEvent(new Event("input", { bubbles: true }));

        expect(validationCallbackSpy).to.have.been.calledWith(element, expectation);
        resetValidationCallbackSpy();
      });
    }
  });
}