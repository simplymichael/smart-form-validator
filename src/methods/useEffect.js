const effects = require("../effects");
const errorMessages = require("../error-messages");
const { getEffectNames, preEffectRegistrationCheck } = require("../helpers");

const defaultEffectNames = getEffectNames(effects);

/**
 * @param {Object} effect: 
 * @param {String} [effect.name] (required): The name of this effect, used when registering the effect.
 * @param {Function} [effects.init] (optional): Function that performs any initialization function.
 *    The function is invoked right after the effect is registered.
 *    It receives the current input field as its first argument.
 * @param {Function} [effect.valid] (required): Function to invoke post-validation if the field is valid.
 *    The function receives the validated input field as its first argument.
 * @param {Function} [effect.invalid] (required): Function to invoke post-validation if the field is invalid.
 *    The function is passed the validated input field as its first argument
 * @param {Object} [effect.meta] (optional): Effect meta data, e.g., namespace, author, version, etc.
 * @param {String} [effect.meta.namespace]: used in conjunction with the effect `name` 
 *    to create a unique name for the effect.
 * @returns this.
 */
module.exports = function useEffect(effect) {
  this.effects = this.effects || {};

  const parsedEffect = preEffectRegistrationCheck(effect, defaultEffectNames);

  let { name: effectName, meta, init, valid, invalid } = parsedEffect;

  if(this.effects[effectName]) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "An effect")
        .replace(":key:", effectName)
    );
  }

  this.effects[effectName] = { meta, init, valid, invalid };

  // Add the effect to the elements attached to the instance.
  if(typeof this.getFields === "function") {
    this.getFields().forEach(function registerEffectForField(field) {
      if(!(field.usesEffect(effect.name, effect.meta?.namespace))) {
        field.useEffect(effect);
      }
    });
  }
};