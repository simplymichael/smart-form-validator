/* eslint-env node, mocha */

const { describe } = require("mocha");
const bottomBorderEffect = require("../../src/effects/add-bottom-border");
const { VALID_FIELD_CLASSNAME, INVALID_FIELD_CLASSNAME } = require("../setup");

const classListMethods = {
  add(key, val) {
    this[key] = val;
  }, 
  contains(key) {
    return typeof this[key] !== "undefined";
  }
};

module.exports = {
  arguments: [],
  test: addBottomBorder,
};

function addBottomBorder(it, expect) {
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
    expect(bottomBorderEffect).to.be.an("object");
    expect(bottomBorderEffect).to.have.property("name", "addBottomBorder");
    expect(bottomBorderEffect).to.have.property("meta");
    expect(bottomBorderEffect).to.have.property("valid");
    expect(bottomBorderEffect).to.have.property("invalid");
    expect(bottomBorderEffect.meta).to.be.an("object");
    expect(bottomBorderEffect.valid).to.be.a("function");
    expect(bottomBorderEffect.invalid).to.be.a("function");
  });

  describe(".valid(field)", function() {
    it("should take no action if passed a non-object", function() {
      const testArray = new Array();
      const testFunction = function testFunction() {};

      testArray.classList = { 
        add: classListMethods.add.bind(testArray),
        contains: classListMethods.contains.bind(testArray),
      };

      testFunction.classList = { 
        add: classListMethods.add.bind(testFunction),
        contains: classListMethods.contains.bind(testFunction),
      };
      
      const fields = [testArray, testFunction];

      fields.forEach(function assertFieldIgnored(field) {
        bottomBorderEffect.valid(field);
  
        expect(field.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
        expect(field.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
      });
    });

    it("should take no action on a submit button", function() {
      const btn = this.test.submitBtn;

      bottomBorderEffect.valid(btn);

      expect(btn.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });

    it("should add the appropriate classnames to the field", function() {
      Array.from(this.test.formElements).forEach(function assertValidOnElement(element) {
        if(["name-field", "username-field", "email-field"].includes(element.id)) {
          bottomBorderEffect.valid(element);
  
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(true);
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
        }
      });
    });
  });

  describe(".invalid(field)", function() {
    it("should take no action if passed a non-object", function() {
      const testArray = new Array();
      const testFunction = function testFunction() {};

      testArray.classList = { 
        add: classListMethods.add.bind(testArray),
        contains: classListMethods.contains.bind(testArray),
      };

      testFunction.classList = { 
        add: classListMethods.add.bind(testFunction),
        contains: classListMethods.contains.bind(testFunction),
      };
      
      const fields = [testArray, testFunction];

      fields.forEach(function assertFieldIgnored(field) {
        bottomBorderEffect.invalid(field);
  
        expect(field.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
        expect(field.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
      });
    });

    it("should take no action on a submit button", function() {
      const btn = this.test.submitBtn;

      bottomBorderEffect.invalid(btn);

      expect(btn.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
      expect(btn.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(false);
    });

    it("should add the appropriate classnames to the field", function() {
      Array.from(this.test.formElements).forEach(function assertValidOnElement(element) {
        if(["name-field", "username-field", "email-field"].includes(element.id)) {
          bottomBorderEffect.invalid(element);
  
          expect(element.classList.contains(VALID_FIELD_CLASSNAME)).to.equal(false);
          expect(element.classList.contains(INVALID_FIELD_CLASSNAME)).to.equal(true);
        }
      });
    });
  });
}
