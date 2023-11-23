const SmartField = require( "../../src/smart-field");

const elements = [
  { 
    element: {id: 1, getValue: () => "firstField" }, 
    rule: { description: "first field's rule"} 
  },
];

module.exports = {
  arguments: ["element", "[, rule]"],
  test: SmartFieldConstructor,
};

function SmartFieldConstructor(it, expect) {
  it("should be created with an `id`, `element`, and `validators` properties", function() {
    const el = elements[0];
    const sf = new SmartField(el.element, el.rule);
    
    expect(sf).to.be.an.instanceof(SmartField);
    expect(sf).to.have.property("id", el.element.id);
    expect(sf).to.have.property("element").to.be.an("object");
    expect(sf).to.have.property("validators");
  });
}