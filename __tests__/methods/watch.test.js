const { beforeEach } = require("mocha");
const SmartForm = require( "../../src/smart-form");
const SmartFormValidator = require( "../../src/smart-form-validator");

const {
  APP_CLASSNAME, 
  //DISABLED_FIELD_CLASSNAME,
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
    let emailFieldValid = false;

    const formId = this.test.formId;
    const formElements = this.test.formElements;
    //const submitBtn = this.test.submitBtn;
    const validationCallback = function(element, valid) {
      if(element.id === "name-field") {
        expect(valid).to.equal(nameFieldValid);
      } else if(element.id === "email-field") {
        expect(valid).to.equal(emailFieldValid);
      } else if(element.id === formId) {
        // every field has been validated, validation is complete
        expect(valid).to.equal(nameFieldValid && emailFieldValid);
      }

      if(["name-field", "email-field"].includes(element.id)) {
        expect(element.classList.contains(APP_CLASSNAME)).to.equal(true);
        expect(element.classList.contains(SMART_FIELD_CLASSNAME)).to.equal(true);

        if(!valid) {
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(true);
        } else {
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(true);
        }
      }
    };

    //const formState = (
    new SmartForm(formId)
      .addRule({ field: "name-field", length: { min: 3, max: 7 } })
      .addRule({ field: "email-field", type: "email" })
      .watch(validationCallback);
    //);


    Array.from(formElements).forEach(function assertWatchingElement(element) {
      if(element.id === "name-field") {
        element.dispatchEvent(new Event("input", { bubbles: true }));

        element.value = "John";
        nameFieldValid = true;
        element.dispatchEvent(new Event("input", { bubbles: true }));
      } else if(element.id === "email-field") {
        element.dispatchEvent(new Event("input", { bubbles: true }));

        element.value = "Jane@doe-family.com";
        emailFieldValid = true;
        element.dispatchEvent(new Event("input", { bubbles: true }));
      } /*else if(element.role === "submit-button") {

      }*/
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