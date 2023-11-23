/* eslint-env node, mocha */

const chai = require("chai");
const chaidom = require("chai-dom");
const jsdom = require("jsdom");
const jsdomGlobal = require("jsdom-global");
const mocha = require("mocha");

const { expect } = chai;
const { JSDOM } = jsdom;
const { describe, it } = mocha;
const APP_CLASSNAME = "sfv";
const VALID_FIELD_CLASSNAME = "ok";
const INVALID_FIELD_CLASSNAME = "error";


chai.use(chaidom);
jsdomGlobal();


beforeEach((done) => {
  JSDOM.fromFile("__tests__/html/field.html")
    .then((dom) => {
      global.document = dom.window.document;
      global.$ = global.document.querySelector.bind(global.document);
    })
    .then(done, done);
});


module.exports = {
  it, 
  expect,
  describe,
  APP_CLASSNAME, 
  VALID_FIELD_CLASSNAME, 
  INVALID_FIELD_CLASSNAME,
};
