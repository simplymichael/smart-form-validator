/* eslint-env node, mocha */

const { describe } = require("mocha");
const toggleSubmitButtonEffect = require("../../src/effects/toggle-submit-button");
const {
  //sinon,
  APP_CLASSNAME, 
  DISABLED_FIELD_CLASSNAME,
  VALID_FIELD_CLASSNAME, 
  INVALID_FIELD_CLASSNAME,
} = require("../setup");


module.exports = {
  arguments: [],
  test: toggleSubmitButton,
};

function toggleSubmitButton(it, expect) {
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

  it("should be an object", function() {
    expect(toggleSubmitButtonEffect).to.be.an("object");
    expect(toggleSubmitButtonEffect).to.have.property("name", "toggleSubmitButton");
    expect(toggleSubmitButtonEffect).to.have.property("meta");
    expect(toggleSubmitButtonEffect).to.have.property("init");
    expect(toggleSubmitButtonEffect).to.have.property("valid");
    expect(toggleSubmitButtonEffect).to.have.property("invalid");
    expect(toggleSubmitButtonEffect.meta).to.be.an("object");
    expect(toggleSubmitButtonEffect.init).to.be.a("function");
    expect(toggleSubmitButtonEffect.valid).to.be.a("function");
    expect(toggleSubmitButtonEffect.invalid).to.be.a("function");
  });

  describe(".valid(btn)", function() {
    it("should take no action on a non-submit button", function() {
      Array.from(this.test.formElements).forEach(function assertElementIgnored(element) {
        if(["name-field", "username-field", "email-field"].includes(element.id)) {
          toggleSubmitButtonEffect.valid(element);
  
          expect(element.getAttribute("disabled")).to.equal(null);
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
          expect(element.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(false);
        }
      });
    });

    /*it("should fail silently with an error if it's unable to update the button", function() {
      const submitBtn = wrapWithDOMFunctionality({ type: "submit" });
      delete submitBtn.setAttribute;
      delete submitBtn.removeAttribute;
      
      const errMsg = "Unable to modify the submit button state: submitBtn.removeAttribute is not a function";
      const spy = sinon.spy(console, "log");

      toggleSubmitButtonEffect.valid(submitBtn);

      expect(spy).to.have.been.calledWith(errMsg);
      console.log.restore();
    });*/

    it("should remove the \"disabled\" attribute and smart-form-validator-related classnames from the field", function() {
      const btn = this.test.submitBtn;

      toggleSubmitButtonEffect.valid(btn);

      expect(btn.getAttribute("disabled")).to.equal(null);
      expect(btn.classList.contains(APP_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });
  });

  describe(".invalid(field)", function() {
    it("should take no action on a non-submit button", function() {
      Array.from(this.test.formElements).forEach(function assertElementIgnored(element) {
        if(["name-field", "username-field", "email-field"].includes(element.id)) {
          toggleSubmitButtonEffect.invalid(element);
  
          expect(element.getAttribute("disabled")).to.equal(null);
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
          expect(element.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(false);
        }
      });
    });

    it("should add the \"disabled\" attribute and smart-form-validator-related classnames to the field", function() {
      const btn = this.test.submitBtn;

      toggleSubmitButtonEffect.invalid(btn);

      expect(btn.getAttribute("disabled")).to.equal("true");
      expect(btn.classList.contains(APP_CLASSNAME)).to.equal(true);
      expect(btn.classList.contains(DISABLED_FIELD_CLASSNAME)).to.equal(true);
      expect(btn.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });
  });
}
