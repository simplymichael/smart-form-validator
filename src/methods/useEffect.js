const errorMessages = require("../error-messages");
const { is, generateEffectName } = require("../helpers");

/**
 * 
 * @param {Object} effect: 
 * @param {String} [effect.name] (required): The name of this effect, used when registering the effect.
 * @param {Object} [effect.meta] (optional): Effect meta data, e.g., namespace, author, version, etc.
 * @param {Function} [effects.init] (optional): Function that performs any initialization function.
 *    The function is invoked right after the effect is registered.
 *    It receives the current input field as its first argument.
 * @param {Function} [effect.valid] (required): Function to invoke post-validation if the field is valid.
 *    The function receives the validated input field as its first argument.
 * @param {Function} [effect.invalid] (required): Function to invoke post-validation if the field is invalid.
 *    The function is passed the validated input field as its first argument
 * @returns this.
 */
module.exports = function useEffect(effect) {
  this.effects = this.effects || {};

  if(!(is.object(effect))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "object")
    );
  }

  const { name, meta: { namespace } } = effect;
  const effectName = generateEffectName(name, namespace);

  if(!(this.effects[effectName])) {
    this.effects[effectName] = effect;
  }

  // If this is an instance of SmartForm or SmartFormValidator,
  // then add the effect to the elements attached to the instance.
  if(typeof this.toJSON === "function") {
    this.toJSON().forEach(field => {
      if(!(field.usesEffect(name, namespace))) {
        field.useEffect(effect);
      }
    });
  }
};