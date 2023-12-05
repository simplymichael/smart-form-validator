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
const DISABLED_FIELD_CLASSNAME = "sfv-disabled";
const SMART_FIELD_CLASSNAME = "sfv-sf";
const VALID_FIELD_CLASSNAME = "sfv-ok";
const INVALID_FIELD_CLASSNAME = "sfv-error";


chai.use(chaidom);
jsdomGlobal();


beforeEach((done) => {
  JSDOM.fromFile("__tests__/html/index.html")
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
  DISABLED_FIELD_CLASSNAME,
  SMART_FIELD_CLASSNAME,
  VALID_FIELD_CLASSNAME, 
  INVALID_FIELD_CLASSNAME,
};
