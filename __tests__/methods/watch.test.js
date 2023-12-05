const { beforeEach } = require("mocha");
const SmartForm = require( "../../src/smart-form");
const SmartFormValidator = require( "../../src/smart-form-validator");

const {
  sinon,
  APP_CLASSNAME, 
  DISABLED_FIELD_CLASSNAME,
  SMART_FIELD_CLASSNAME,
  VALID_FIELD_CLASSNAME, 
  INVALID_FIELD_CLASSNAME,
} = require("../setup");


module.exports = {
  arguments: [],
  test: watch,
};


function watch(it, expect) { 
  beforeEach(function(done) {
    const formId = "signup-form";
    const form = $(`#${formId}`); // eslint-disable-line
    const formElements = form.elements;
    const submitBtn = $("[role='submit-button']"); // eslint-disable-line

    this.currentTest.formId = formId;
    this.currentTest.form = form;
    this.currentTest.formElements = formElements;
    this.currentTest.submitBtn = submitBtn;

    done();
  });

  it("should watch elements on a SmartForm instance", function() {
    let nameFieldValid = false; 
    let usernameFieldValid = false;
    let emailFieldValid = false;

    const formId = this.test.formId;
    const formElements = this.test.formElements;
    const submitBtn = this.test.submitBtn;
    let validationCallbackSpy = sinon.spy();
    const resetValidationCallbackSpy = function() {
      validationCallbackSpy = sinon.spy();
    };
    const validationCallback = function(element, valid) {
      validationCallbackSpy(element, valid); // This lets us know if our validation callback was invoked.

      if(element.id === "name-field") {
        expect(valid).to.equal(nameFieldValid);
      } else if(element.id === "username-field") {
        expect(valid).to.equal(usernameFieldValid);
      } else if(element.id === "email-field") {
        expect(valid).to.equal(emailFieldValid);
      } else if(element.id === formId) {
        // every field has been validated, validation is complete
        expect(valid).to.equal(nameFieldValid && usernameFieldValid && emailFieldValid);

        if(!valid) {
          expect(submitBtn.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(true);
        } else {
          expect(submitBtn.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(false);
        }
      }

      if(["name-field", "username-field", "email-field"].includes(element.id)) {
        expect(element.classList.contains(APP_CLASSNAME)).to.equal(true);
        expect(element.classList.contains(SMART_FIELD_CLASSNAME)).to.equal(true);

        if(!valid) {
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(true);
        } else {
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(true);
        }
      }
    };

    const formState = (
      new SmartForm(formId)
        .addRule({ field: "name-field", type: "ascii", length: { min: 3, max: 7 } })
        .addRule({ field: "username-field", type: "alpha", length: { min: 3, max: 7 } })
        .addRule({ field: "email-field", type: "email" })
        .watch(validationCallback)
    );

    expect(formState).to.be.an("object");
    expect(formState).to.have.property("valid");
    expect(formState.valid).to.be.a("function");

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
  });

  it("should watch elements on a SmartFormValidator instance", function() {
    new SmartFormValidator()
      .addField("firstname-field", { length: { min: 3, max: 7 } })
      .addField("accept-terms-field")
      .addRule({ field: "accept-terms-field", type: "checkbox", required: true })
      .watch();
  });

  it("should watch elements on a SmartForm instance obtained via a SmartFormValidator instance", function() {
    const form = this.test.form;
    new SmartFormValidator()
      .addForm(form)
      .addRule({ field: "name-field", length: { min: 2, max: 7 } })
      .addRule({ field: "email-field", type: "email" })
      .watch();
  });
}