module.exports = {
  arguments: ["fields"],
  test: addFields,
};

function addFields(it, expect) {
  it("should fail without error if the `fields` argument is not an array", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addFields(null);
    context.addFields({});
    context.addFields("string field");
    context.addFields(12345);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
  });

  it("should fail silently if the `fields` argument is an empty array", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addFields([]);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
  });

  it("should add the specified fields along with their rules, if specified", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);

    context.addFields([ 
      { 
        field: { id: 1 }, 
        rule: { type: "alnum" } 
      } 
    ]);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
    expect(context.getField(1).getRule()).to.have.property("type", "alnum");
    expect(context.getField(1).getRule()).not.to.have.property("length");

    context.addFields([
      {
        field: { id: "username" }, 
        rule: { 
          length: { min: 3, max: 25 } 
        }
      },
      {
        field: { id: 3 }, 
        rule: { type: "number" }
      }
    ]);

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(3);
    expect(context.getField(1).getRule()).to.have.property("type", "alnum"); // ensure existing fields not overwritten.
    expect(context.getField("username").getRule()).to.have.property("length");
    expect(context.getField("username").getRule().length).to.deep.equal({ min: 3, max: 25 });
    expect(context.getField(3).getRule()).to.have.property("type", "number");
  });
}