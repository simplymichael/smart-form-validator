/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
module.exports = function getEffects(type) {
  let result;

  // TO DO: implement this in a more-performant way.
  this.toJSON().forEach(field => {
    const effects = field.getEffects(type);

    if(["addon", "default"].includes(type)) {
      result = populateMap(effects, new Map());
    } else {
      const { default: defaults, addon: addons } = effects;

      result = populateMap(defaults, new Map());
      result = populateMap(addons, result);
    }
  });

  return result;
};

function populateMap(sourceMap, targetMap) {
  for(const [key, value] of sourceMap.entries()) {
    if(!(targetMap.has(key))) {
      targetMap.set(key, value);
    }
  }

  return targetMap;
}
