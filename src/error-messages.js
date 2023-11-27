module.exports = {
  fieldNotRegistered: "No field with the specified id (\":id:\") has been registered on this :element:",
  functionParamExpectsType: "The `:param:` argument expects :type:",
  functionParamIsRequired: "The `:param:` argument is required",
  htmlElementExpected: "The `:param:` argument expects an HTML `:elementType:` element",
  noObjectWithSpecifiedKey: "No :object: with the key `:key:` exists",
  noValidatorsActive: "There are no active validators for this field. " +
    "You can do one of the following to fix this issue: " + 
    "1. Re-enable any disabled validators by calling `enableValidator(key)` \n" + 
    "2. Add a rule using the `addRule(rule)` method \n" +
    "3. Add a validator using the `addValidator(key, validator, meta)` method",
  objectExpected: "The `:param:` argument expects an object",
  objectPropertyCannotBeEmpty: "The `:prop:` property of the `:object:` object cannot be empty",
  objectMustHaveProperty: "The `:param:` argument must have a `:prop:` property",
  objectsMustHaveProperty: "The `:paramA:` argument must have a `:propA:` property or The `:paramB:` argument must have a `:propB:` property",
  objectPropertyShouldHaveType: "The `:prop:` property of the `:object:` object shoulde be :type:",
  objectWithKeyExists: ":object: with key :key: already exists",
  objectWithKeyExistsCanReplace: ":object: with key `:key:` already exists. Use `:replacer:` to replace it.",
  argNamesNotAllowed: "The following :argNames: are reserved and cannot be used as :argTypes:: \n:argValues:"
};