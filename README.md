# Smart Form Validator
A highly customizable, "somewhat" declarative approach to HTML form fields validation.

[![NPM version][npm-version-image]][npm-url]
[![Node version][node-version-image]][node-url]
[![NPM Downloads][npm-downloads-image]][package-url]
[![License][license-image]][license-url]
[![Conventional commits][conventional-commits-image]][conventional-commits-url]
[![Tests][ci-image]][ci-url]
[![Coverage][codecov-image]][codecov-url]


## 
<img src="./imgs/smart-form-validator-demo-8.gif" alt="smart-form-validator Demo - Sign up form" />


## Installation

**Using npm:**

```bash
npm install smart-form-validator --save
```

Later in our code: 

```js
import SmartFormValidator from "smart-form-validator";

// Or if you prefer: 
// const SmartFormValidator = require("smart-form-validator");
```

**Using jsDelivr CDN:**
```html
<script 
  src="https://cdn.jsdelivr.net/npm/smart-form-validator/dist/smart-form-validator.min.js"></script>
``` 
`SmartFormValidator` is now available as a property of the global object.

**Using unpkg CDN:**
```html
<script src="https://unpkg.com/smart-form-validator/dist/smart-form-validator.min.js"></script>
```
`SmartFormValidator` is now available as a property of the global object.

### Applying default effects styles
To get the default effects styles applied to our form fields, we need to add the CSS file to our page. 

**Using jsDelivr CDN:**
```html
<link href="https://cdn.jsdelivr.net/npm/smart-form-validator/dist/css/smart-form-validator.min.css" 
  rel="stylesheet" />
```

**Using unpkg CDN:**
```html
<link href="https://unpkg.com/smart-form-validator/dist/css/smart-form-validator.min.css" 
  rel="stylesheet" />
```


## Quick start
```html
<html>
  <body>
    <form id="signup-form">
      <input type="text" id="name-field" />
      <input type="email" id="email-field" />
      <button role="submit-button">Sign up</button>
    </form>

    <script src="signup-form-validator.js"></script>
  </body>
</html>
```

```js
// File: signup-form-validator.js

import SmartFormValidator from "smart-form-validator";

const form = document.getElementById("test-form");

new SmartFormValidator()
  .addForm(form)
  .addRule({ field: "name-field", type: "ascii" }) // acccepts only ASCII chars including whitespace
  .addRule({ field: "email-field", type: "email" }) // accepts only valid emails (format, not function)
  .watch(); // watch the input fields for changes, ensuring that they adhere to the specified constraints
```


## 
The idea behind *Smart Form Validation* is simple. 
A form has input fields; Each field has conditions and constraints that data entered into it must 
satisfy to be considered valid. When a field receives input from a user, 
our code validates the input value to ensure that it satisfies the constraints placed on that field. 
Acting on the result of that check, some form of 
state change may be effected on the input element or the entire form, 
letting the user know whether or not 
they have entered the expected type of value in the field before they even attempt to submit the form 
for processing. In some cases, we may even limit their ability to submit the form if 
they have entered incorrect values into one or more of the form fields.

*Smart Form Validation* inserts a semantic boundary between these ideas by "separating" them into 
**fields** (receptors of user values), 
**rules** (constraints on fields),
**validators** (checks that ensure that a field's value adheres to the constraints placed on that field), and 
**effects** (state changes on a form field 
that give the user (instant) feedback regarding the value they have entered into the field).


## Concepts (summary)
1. **Fields:** Fields are elements that can receive user input. They represent the objects we want to validate.
2. **Rules:** Rules specify constraints on fields. 
   They state the conditions that field values must fulfill to be valid.
3. **Validators:** Validators check that data entered into fields 
   comply with the rules specified for those fields. 
4. **Effects:** Effects are actions that perform state changes on fiedls based on the results of validation.


## Concepts (details)
### 1. Fields 
<a id="fields"></a>
A field is a receptor of user data and is the subject of validation. A field can be any HTML element type
such as `input`, `checkbox`, `textarea`, `select`, and `contenteditable` elements.
A field must have an `id` property. A field may optionally have a `role` and a `getValue` properties.

If we have a `button` or `input` whose `type` is not `submit`
but on which we want effects that handle submit buttons to have access, 
a `role` attribute with the value of `submit-button` is required for that field. 

The `getValue` property, if provided, must be a function. 
This function is used to get the current value of the field 
if the field is not a `contenteditable` field and is not one of `input`, `checkbox`, `textarea`, `select`.

The state of a field changes in response to the data entered 
and its adherence to the constraints or rules defined for/placed on that field.

### 2. Rules
<a id="rules"></a>
A rule is an object that specifies the constraint(s) on a field. 
It encapsulates the constraints we want placed on that field.
For any field to be validated, we must attach a rule with at least one constraint to it.

Rules are plain JavaScript objects with one required property: `field`.
The value of the `field` can be either the element's `id` or, 
in instances where we have previously obtained a reference to the element, the element reference.

Other properties of a rule depend on the type of the field and 
specify the constraints we want placed on the target field. 

#### Default constraints
The current default supported rules are: 
- **`type` {String}:** specifies the acceptable data type of the value for this field, 
  one of either (`"alnum"`|`"alpha"`|`"ascii"`|`"email"`|`"number"`). Default is `alnum`.
- **`required` {Boolean}:** specifies whether the field is required (`true`) or not (`false`).
- **`length` {Number|Object}:** specifies the accepted (minimum or maximum or both) input length. 
  If the value is a number, it specifies the maximum length.
  If the value is an object, it specifies. the minimum and/or maximum length: 
    - **`length.min` {Number}:** specifies the mininum input length.
    - **`length.max` {Number}:** specifies the maximum input length.
- **`matchCase` {Boolean}:** performs a case-sensitive (true) or case-insensitive (false) validation.
- **`allowWhitespace` {Boolean}:** specifies whether the field allows whitespace values or not.
- **`regex` {Object|String}:** specifies a custom validation regex. 
  This can be a regex string or regex object.

To specify that a field accepts only numbers that are between 3 to 7 characters, for example, 
we'd create a rule with the following constraints: 

```js
const rule = { 
  field: someFieldRefOrItsId, 
  type: "number", 
  length: { 
    min: 3, 
    max: 7 
  } 
};

new SmartformValidator()
  .addForm(form)
  .addRule(rule)
```

**Note:** We can create custom rules and write custom validators that check for these rules.
See the the section on [Customizing Smart Form Validator](#customizing-smart-form-validator) for more.

### 3. Validators
<a id="validators"></a>
Validators are like rule "enforcers". 
A validator is a function that checks that the data entered into a field 
complies with the constraints placed on that field. 

### Default validators
The following validators come built-in corresponding with the default constraints: 
- **`alphaValidator`:** checks that a field contains only the letters `A - Z`, underscores (`_`), and dashes (`-`).
  The field can also accept whitespace characters with the `allowWhitespace` constraint set to `true`.
  To perform a case-insensitive check, set the `matchCase` constraint to `false`.
- **`alphanumericValidator`:** checks that a field contains only the letters `A - Z`, the numbers `0 - 9`, 
  underscores (`_`), and dashes (`-`).
  The field can also accept whitespace characters with `allowWhitespace` set to true.
  To perform a case-insensitive check, set `matchCase` to `false`.
- **`asciiTextValidator`:** checks that a field contains only characters from the [ASCII character-set][ascii]. 
  This validator accepts whitespace characters by default irrespective of the value of `allowWhitespace`. 
  However, we can specify a case-insensitive match by setting `matchCase` to `false`.
- **`emailValidator`:** checks that the value entered into the field has a valid email format.
- **`lengthValidator`:** checks that the value entered in the field is between the minimum 
  and/or maximum specified length.
- **`numberValidator`:** checks that a field contains only the numbers `0 - 9`.
  The field can also accept whitespace characters with `allowWhitespace` set to true.
- **`regexValidator`:** checks that a field's value conforms to a custom regular expression constraint.
- **`requiredFieldValidator`:** checks that a field has some data entered into it.

**Notes**
- For a constraint to be checked during validation, there must be a corresponding validator defined for it.
- We can create custom validators that make use of the [default constraints](#default-constraints) 
  or that define their own rules.
  See the [Creating custom validators](#creating-custom-validators) section for more on how to do this.


### 4. Effects
<a id="effects"></a>
An Effect represents an action to be taken based on the outcome of a field's validation.
We can, for example, use an effect to display hints to the user as they input data into a field, 
to disable the submit button and prevent the form from being submitted unless every other field has valid input, 
or to add some special CSS effects to a field to indicate its state as either *valid* or *invalid*.

Having dedicated effect handlers helps reduce the surface area for surprises 
arising from side-effects during form validation.

**Note:** As with rules and validators, we can create and register custom effects that can be applied 
for when a field is either valid or invalid. The section on [Creating custom effects](#creating-custom-effects)
goes into details on how to do this.


## Customizing Smart Form Validator
Smart Form Validator is easy to customize. To customize Smart Form Validator, we just need to, as already stated: 
- (optionally) create custom constraints.
- create custom validators for to check for custom constraints created by us or other third-parties, 
  or for any of the default-supported constraints.
- (optionally) create custom effects to respond to the result of validation 
  from either our own custom validator(s) or the default validators.


### Creating custom validators
A validator is a function that is called to, well... *validate* the data entered into a field.
The validator function is passed the following positional arguments in order: 
1. **`value`:** the data entered by the user into the field. 
2. **`rule`:** an object containing the constraints specified for that field.
   The validator checks that the `value` adheres to the rule.
3. **`prevResult`:** a boolean value that tells the current validator the 
   result of the previous validator in the chain of validators attached to this field.
4. **`extras`:** an object containing any extra information.  
   A checkbox, for example, can have the value `on` or `off` 
   and a `checked` state that can be either `true` or `false`.
   The value (`on` or `off`) will be passed as the first argument (the `value` argument) to the validator.
   The `checked` state will be passed in as `extras.checked`.

A validator should return `true` if the field it is validating passed the validation rule. 
Otherwise it should return `false`.

### Registering validators 
After creating a validator, we must register it with the `addValidator(name, validator, meta)` method
of the `SmartFormValidator` instance.

`addValidator` takes three arguments:
- **`name` {String} (required):** an arbitrary string that can serve as a unique name for the validator.
- **`validator` {Function} (required):** the validator function itself.
- **`meta` {Object} (optional):** an object that holds meta information about the validator. 
  To prevent naming conflict with other validators, we can have a `meta.namespace` property.
  This property should be a string. This string is used in conjunction with the validator `name` 
  to create a unique name for the validator.

#### Tips and best practices for writing validators.
1. Validators should aim at being focused and specific. 
   A validator should deal with just one aspect of the constraints on a field 
   rather than attempting to determine if every constraint on the field has been met.
   For example, instead of having a validator that checks for a `required` state, 
   a maximum length constraint, and whether or not the fields contains numbers, 
   it's better to have separate validators for each of these checks: 
   one to check for `required`, another to ensure the `length` constraint is met, 
   and yet another to check that the `number` constraint is fulfilled.
   Each of these validators will be called with the rule and the result of the previous validator.
2. A validator should return only `true` or `false` values. 
   A validator should not directly perform a side-effect on a field in the event of a 
   successful or failed validation. Any such effects should be delegated to [effects](#effects).

   In the end, the validation process is reduced to a binary *passing* or *failing* test.

### Creating custom effects
Every effect is a plain JavaScript object with the following required properties: 
- **`name` {String}:** the effect name is an arbitrary string used to uniquely identify the effect.
- **`valid`{Function}:** a function to be invoked to handle the case when the field passes validation.
  The function is passed the field as the first argument.
- **`invalid` {Function}:** a function to be called to handle the case when the field fails validation.
  The function is passed the field as the first argument.

An effect object may also contain the following optional properties: 
- **`init` {Function}:** an initialization function that is called 
  to perform any initialization tasks for the effect. 
  This function is called once when the effect is [registered](#registering-effects).
- **`meta` {Object}:** an object that holds meta information (such as author, version, etc) about the effect. 
  A recommended property is `meta.namespace` that helps to prevent naming conflict with other effects.
  This property expects a string value that is used in conjunction with the effect `name` property
  to create a unique name for the effect.

### Registering effects 
After creating an effect, we must register it for it to be applied during form validation. 
An effect can be registered "globally" or "locally".

Registering an effect "globally" makes the effect available to all instances of `SmartFormValidator`.
Just call `useEffect(effect)` statically on the `SmartFormValidator` class like so: 
`SmartFormValidator.useEffect(effect)`.
 
Registering an effect "locally" means the effect is only available to fields managed by the 
`SmartFormValidator` instance on which `useEffect` is called. To do a "local" effect registration, 
call the `useEffect(effect)` method on an instance. For example: 

```js
const validator = new SmartFormValidator();

validator.useEffect(effect);
```

In both cases, `useEffect` expects the complete effect object as its argument.


#### Customizing Smart Form Validator - A quick example 
Say we have a field 
and we want to define a constraint on that field so that it only accepts objects (or JSON strings).
First, we'd create a rule stating that requirement. 
The rule will have a `field` property that specifies the target field. 
We may omit this property while creating the rule, but must specify it when adding the rule to the field.
```js
const objectExpectedRule = { type: "object" };
```

Next, we need to add the rule to the field: 

```js
const fieldId = "someArbitraryIdentifier";
const validator = new SmartFormValidator();

// register the field on the validator, specifying the rule, 
// this can be done in several ways 
// (the first two are useful if the field is a stand-alone field, 
// the last is useful when the field is part of a form): 

// 1. 
validator.addField(fieldId, objectExpectedRule); // specify field and rule in one line 

// Or ...
// 2.  
// validator.addField(fieldId); // register the field 
// validator.addRule({ ...objectExpectedRule, field: fieldId }); // add the rule to the field.

// Or, if the field is part of a form
// 3. 
// validator.addForm(form)
//    .addField(fieldId, objectExpectedRule);
```

Next, we'll create a custom validator to check that the field complies with this constraint: 

```js
function objectValidator(value, rule) {
  // we are only interested in fields with a type of "object", ignore fields we are not interested in.
  if(!rule.type || rule.type !== "object") {
    // we have to return `true` so the next validator does not think the field failed validation
    return true; 
  }

  // We are assuming the field's value is a string in keeping with the value type of form fields, 
  // but if we have a `getValue()` method attached to the field, 
  // we can make a call to `JSON.parse()` inside the `getValue()` method 
  // in which case our test will be something like: 
  // if(!value || typeof value !== "object")
  if(!value || typeof value !== "string") {
    return false;
  }
  
  try {
    const config = JSON.parse(value);

    // `config` property checks go here; For example:
    if(!(prop in config)) {
      return false;
    }
  } catch {
    return false; // validators should always return Boolean values. No `throw` statement here, please.
  }

  return true;
}
```

Finally, we need to register our validator so it can be invoked during the validation process: 
```js
const validatorName = "objectValidator";
const validatorFunc = objectValidator;
const validatorMeta = { // optional but recommended
  namespace: "some-namespace", 
  version: 1.0.0  
}; 

validator.addValidator(validatorName, validatorFunc, validatorMeta);
```


## Running the [examples](./examples)
- Run `npm run examples`
- Navigate to *localhost:8080/examples*


## Contributing
- <a name="report-a-bug">[Report a bug][bug]</a>
- <a name="request-a-new-feature">[Request a new feature][fr]</a>
- <a name="submit-a-pull-request">[Submit a pull request][pr]</a>
- <a name="contributing-guide">Checkout the [Contributing guide][contribute]</a>


## CHANGELOG
See [CHANGELOG][changelog]


## License
[MIT License][license-url]


## Author
[Simplymichael](https://github.com/simplymichael) ([simplymichaelorji@gmail.com](mailto:simplymichaelorji@gmail.com))


## Release process (manual)
- Checkout main branch: `git checkout main`.
- Merge latest changes from develop into main branch: `git merge develop`.
- Build: `npm run build`.
- Run release script: `npm run release:[major|minor|patch]`.
- Inspect the **CHANGELOG.md** file and make any necessary adjustments.
- Inspect the **package.json** file (`package.json.version`) and make any necessary adjustments.
- Stage changes: `git add dist CHANGELOG.md package*.json`
- Commit build and version number bump: 
  `git commit -m "Build latest version, update CHANGELOG.md, and bump version number from <prev_ver> to <curr_ver>"`.
- Tag build: `git tag -a vx.x.x -m "<tag summary>"`.
- Push to github: `git push && git push origin --tags`. 
- Draft release on GitHub (optional).
- Publish to NPM: `npm publish`.
- Checkout develop branch: `git checkout develop`.
- Merge updates from main branch into develop: `git merge main`.







[npm-url]: https://npmjs.com/package/smart-form-validator
[npm-version-image]: https://img.shields.io/npm/v/smart-form-validator
[node-url]: https://nodejs.org/
[node-version-image]: https://img.shields.io/node/v/smart-form-validator
[package-url]: https://npm.im/smart-form-validator
[npm-downloads-image]: https://img.shields.io/npm/dm/smart-form-validator
[license-url]: https://github.com/simplymichael/smart-form-validator/blob/main/LICENSE.md
[license-image]: https://img.shields.io/github/license/simplymichael/smart-form-validator
[conventional-commits-url]: https://conventionalcommits.org
[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg
[ci-url]: https://github.com/simplymichael/smart-form-validator/actions/workflows/run-coverage-tests.yml
[ci-image]: https://github.com/simplymichael/smart-form-validator/workflows/tests/badge.svg
[codecov-url]: https://codecov.io/gh/simplymichael/smart-form-validator
[codecov-image]: https://img.shields.io/codecov/c/github/simplymichael/smart-form-validator?token=IGGXAP7WXO

[ascii]: https://en.wikipedia.org/wiki/ASCII
[bug]: https://github.com/simplymichael/smart-form-validator/labels/bug
[changelog]: https://github.com/simplymichael/smart-form-validator/blob/master/CHANGELOG.md
[contribute]: https://github.com/simplymichael/smart-form-validator/blob/master/CONTRIBUTING.md
[fr]: https://github.com/simplymichael/smart-form-validator/labels/feature%20request
[pr]: https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request
