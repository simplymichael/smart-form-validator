const effects = require("../effects");
const { is } = require("../helpers");

const defaultEffects = {};

for(const effect of Object.values(effects)) {
  const { name, meta, init, valid, invalid } = effect;

  defaultEffects[name] = { meta, init, valid, invalid };
}

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
module.exports = function getEffects(type) {
  type = is.string(type) ? type.trim().toLowerCase() : "";

  const addonEffects = this.effects || null;

  if(["addon", "default"].includes(type)) {
    switch(type) {
    case "default": return defaultEffects;
    case "addon"  : return addonEffects;
    }
  } else {
    return {
      default: defaultEffects,
      addon: addonEffects,
    };
  }
};
