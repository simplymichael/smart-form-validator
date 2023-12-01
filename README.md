# Smart Form Validator
Declarative HTML form fields validation.


The idea behind Smart Form Validation is simple. 
A form has fields; and each field has constraints that specify what type of data it expects.
When a user enters some value into a field, our code checks to ensure the value they entered corresponds
to the expected format for that field. 
Based on the result of that check, a visual cue is shown to the user to let them know instantly
whether or not they have correctly or incorrectly filled the field before they even attempt to submit the form 
for processing. In some cases, we may even limit their ability to submit the form if 
the values they entered into one or more of the fields is incorrect.

Simple Form Validation helps us to reason about these different yet interconnected ideas by 
"separating" them into **fields** (receptors of user values), **rules** (constraints on fields),
**validators** (checks that ensure that a field's value meets the constraints set for that field), 
and **effects** 
(visual indications that give the user instant feedback regading the values they have entered into the field).

## Quick start
```html
<html>
  <body>
    <form id="signup-form">
      <input type="text" id="name-field" />
      <input type="email" id="email-field" />
      <button role="submit-button">Sign up</button>
    </form>

    <script src="signup-processor.js"></script>
  </body>
</html>
```

```js
// signup-processor.js
const form = document.getElementById("test-form");

new SmartFormValidator()
  .addForm(form)
  .addRule({ field: "name-field", type: "ascii", allowWhitespace: true }) // acccepts only ASCII chars and whitespace
  .addRule({ field: "email-field", type: "email" }) // accepts only valid emails (format, not function)
  .watch(); // watch the input fields for changes and enforce the specified constraints
```

## Concepts (summary)
- Fields: Fields represent the elements you want to validate.
- Rules: Rules specify constraints on fields.
- Validators: Validators check that  
  values entered into fields comply with the constraints specified on those fields. 
- Effects: Effects are actions that should be carried out based on validation results.

## Concepts (details)
### Fields 
A field is the subject of validation. A field can be any HTML element type
such as `input`, `checkbox`, `textarea`, `select`, and `contenteditable` elements.
A field must have an `id` property. A field can optionally also have a `role` and a `getValue` properties.

A `role` with the value of `submit-button` is required if you want 
a effects that handle submit buttons to have access to the button 
but the button's is not of an `input` or a `button` filed with a type of `submit`.

The `getValue` property must be a function. This function is used to get the value of the field 
if the field is not one of `input`, `checkbox`, `textarea`, `select`, and a `contenteditable` field.

### Rules
A rule is an object that specifies the constraint on a field.
For any field to be validated, you must attach at least one rule to it.

Rules are plain JavaScript objects with one required property: `field`.
The value of the `field` can be either the element's id or the element itself, 
if you previously have a reference to the element.

Other properties of a rule are dependent on the type of the field 
and the constraints you want placed on that field. 

#### Supported rules
The currently supported rules are: 
- `type` (String): specifies the acceptable data type of the value for this field, 
  one of either ("alnum"|"alpha"|"ascii"|"email"|"number"). Default is alnum.
- `required` (Boolean): specifies whether the field is required (true) or not (false).
- `length` (Number|Object): specifies the accepted (minimum or maximum or both) input length. 
  If the value is a number, it specifies the maximum length.
  If the value is an object, it specifies. the minimum and/or maximum length: 
    - `length.min` (Number): specifies the mininum input length.
    - `length.max` (Number): specifies the maximum input length.
- `matchCase` (Boolean): performs a case-sensitive (true) or case-insensitive (false) validation.
- `allowWhitespace` (Boolean): specifies whether to allow whitespace in the value or not.
- `regex` (Object|String): specifies a custom validation regex. This can be a regex string or regex object.

To specify that a field accepts only numbers that are between 3 to 7 characters, you'd use a rule like this: 
```js
const rule = { field: someFieldOrItsId, type: "number", length: { min: 3, max: 7 } };

new SmartformValidator()
  .addForm(form)
  .addRule(rule)
```

**Note:** You can create your own rules and write custom validators that check for and enforce them.

### Validators
Validators are rule enforcers. 
A validators is a function that checks the value entered into a field 
and ensures that it complies with the constraints specified on the field. 

### Built-in validators
The following are the built-in validators corresponding with the built-in rules: 
- `alphaValidator`: checks that a field contains only the letters `A - Z`, underscores (`_`), and dashes (`-`).
  The field can also accept whitespace characters with the `allowWhitespace` rule set to true.
  To perform a case-insensitive check, set the `matchCase` rule to `false`.
- `alphanumericValidator`: checks that a field contains only the letters `A - Z`, the numbers `0 - 9`, 
  underscores (`_`), and dashes (`-`).
  The field can also accept whitespace characters with the `allowWhitespace` rule set to true.
  To perform a case-insensitive check, set the `matchCase` rule to `false`.
- `asciiTextValidator`: checks that a field contains only characters from the ASCII character-set. 
  This validator accepts whitespace characters by default irrespective of the value of the 
  `allowWhitespace` rule. However, you can specify a case-insensitive match by setting the 
  `matchCase` rule to `false`.
- `emailValidator`: checks that the value entered into the field has a valid email form.
- `lengthValidator`: checks that the value entered in the field is between the minimum 
  and/or maximum specified length.
- `numberValidator`: checks that a field contains only the numbers `0 - 9`.
  The field can also accept whitespace characters with the `allowWhitespace` rule set to true.
- `regexValidator`: lets us specify a custom regex for validating the field.
- `requiredFieldValidator`: takes a boolean value indicating whether the field is required (`true`) or not (`false`).

**Notes:**: 
- For a rule to be enforced, there must be a validator defined to enforce its constraints.
- You can create custom validators that make use of the available rules or that define their own rules.

#### Creating validators
A validator is just a function that is called to validate the value entered into a field
The validator function is passed the following arguments in order: 
1. `value`: this is the value entered by the user into the field. 
2. `rule`: this is an object containing the rules specified for that field.
   The validator checks that the `value` adheres to the rules.
3. `prevResult`: this is a boolean value that lets the validator know the 
   result of the previous validator in the chain of validators attached to this field.
4. `extras`: an object containing any extra information. For example, 
   a checkbox can have the value `on` or `off` and a `checked` state that can be either `true` or `false`.
   The value (`on` or `off`) will be passed as the first argument to the validator.
   The `checked` state will be passed in as `extras.checked`.

A validator should return `true` if the field passed the validation rules. Otherwise it should return `false`.

#### Registering validators 
After creating a validator, you must register it with the `addValidator(name, validator, meta)` method.
`addValidator` takes three arguments:
- `name` (required): an arbitrary string that serves as a unique name for the validator.
- `validator` (required): the validator function itself.
- `meta` (optional): an object that holds meta information about the validator. 
  To prevent naming conflict with other validators, you can have a `meta.namespace` property.
  This property should be a string. This string is used in conjunction with the validator `name` 
  to create a unique name for the validator.

#### Tips and best practices for writing validators.
1. Validators should be focused and specific. 
   A validator should deal with just one aspect of the constraints on a field 
   rather than attempting to determine if every constraint on the field has been met.
   For example, instead of having a validator that checks for a `required` state, 
   a maximum length constraint, and whether or not the fields contains numbers, 
   it's better to have separate validators for each of these checks: 
   one to check for `required`, another to enforce the length rule, and another to check for numbers.
   Each of these validators will be called with the rule and the result of the previous validator.
2. A validator should return only `true` or `false` values. 
   A validator should not carry out any action directly on the field in the event of a 
   successful or failed validation. Any such effects should be delegated to [effects](#effects).


### Effects
An Effect is an action that should be taken (on a field) based on the result of the validation for a given field.
For example, you can use an effect to display hints to the user while they enter values into a field, 
to disable a submit button unless every other field has valid input, 
or to add some special CSS effects to a field to indicate its state as either *valid* or *invalid*.


#### Creating effects
Every effect is a plain JavaScript object with the following required properties: 
- `name`: the effect name is an arbitrary string used to uniquely identify the effect.
- `valid`: a function to be invoked to handle the case when the field passed validation.
  The function is passed the field as the first argument.
- `invalid`: a function to be called to handle the case when the field failed validation.
  The function is passed the field as the first argument.

An effect object may also contain the following optional properties: 
- `init`: an initialization function that is called to perform any initialization tasks for the effect.
  This function is called once when the effect is registered.
- `meta`: an object that holds meta information (such as author, version, etc) about the effect. 
  An important and recommended property is `effect.namespace` 
  which helps to prevent naming conflict with other effects.
  This property expects a string value that is used in conjunction with the effect `name` 
  to create a unique name for the effect.

#### Registering effects 
After creating an effect, you must register it. An effect can be registered "globally" or "locally".

Registering an effect "globally" makes the effect available to all instances of `SmartFormValidator`.
Just call `useEffect(effect)` statically on the `SmartFormValidator` class like so: 
`SmartFormValidator.useEffect(effect)`.
 
Registering an effect "locally" means the effect is only available to fields within the 
current `SmartFormValidator` instance. To do a "local" effect registration, 
call the `useEffect(effect)` method on an instance. For example: 
```js
const instance = new SmartFormValidator();

instance.useEffect(effect);
```

In both cases, `useEffect` expects the complete effect object as its argument.
  
## Testing
- Run all tests: `npm test`.
- Test a module: `npm test -- --<module_name>`. 
  Example: `npm test -- --SmartFormValidator`.
- Test a method: `npm test -- --<module_name>::<method_name>`. 
  Example: `npm test -- --SmartFormValidator::addField`.