const effects = require("../../src/effects");

const defaultEffects = {};

for(const effect of Object.values(effects)) {
  const { name, meta, init, valid, invalid } = effect;

  defaultEffects[name] = { meta, init, valid, invalid };
}

module.exports = {
  arguments: ["input", "[, rule]"],
  test: getEffects,
};


function getEffects(it, expect) {
  it("should return only specified effect types", function() {
    let effectType;
    let effects;
    const context = this.test.context;

    effectType = "default";
    effects = context.getEffects(effectType);

    expect(effects).to.be.an("object");
    
    for(const effect of Object.values(effects)) {
      const { name } = effect;

      expect(effects[name]).to.deep.equal(defaultEffects[name]);
    }

    effectType ="addon";
    effects = context.getEffects(effectType);

    expect(effects).to.equal(null);
  });

  it("should return all effect types if an invalid type is specified", function() {
    const context = this.test.context;
    const effectType = "extras";
    const effects = context.getEffects(effectType);

    expect(effects).to.be.an("object");
    expect(Object.keys(effects)).to.have.length(2);
    expect(effects).to.have.property("default");
    expect(effects).to.have.property("addon");
    expect(effects).not.to.have.property(effectType);
    expect(effects.default).to.be.an("object");
    expect(effects.addon).to.equal(null);
    
    for(const effect of Object.values(effects.default)) {
      const { name } = effect;

      expect(effects[name]).to.deep.equal(defaultEffects[name]);
    }
  });

  it("should return all effect types if no type is specified", function() {
    const context = this.test.context;
    const effects = context.getEffects();

    expect(effects).to.be.an("object");
    expect(Object.keys(effects)).to.have.length(2);
    expect(effects).to.have.property("default");
    expect(effects).to.have.property("addon");
    expect(effects.default).to.be.an("object");
    expect(effects.addon).to.equal(null);
    
    for(const effect of Object.values(effects.default)) {
      const { name } = effect;

      expect(effects[name]).to.deep.equal(defaultEffects[name]);
    }
  });
}