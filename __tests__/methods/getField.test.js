module.exports = {
  arguments: ["fieldId"],
  test: getField,
};


function getField(it, expect) {
  it("should return `null` if no field has been added", function() {
    const context = this.test.context;

    expect(context.getField(1)).to.equal(null);
    expect(context.getField("firstname")).to.equal(null);
  });

  it("should return `null` if field with specified id is not found", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
    expect(context.getField(1)).to.equal(null);
    expect(context.getField("firstname")).to.equal(null);

    context.addField({ id: "firstname" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
    expect(context.getField("username")).to.equal(null);
  });

  it("should return field with given id", function() {
    const context = this.test.context;
    const fieldId = "firstname";

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
    expect(context.getField(1)).to.equal(null);
    expect(context.getField(fieldId)).to.equal(null);

    context.addField({ id: fieldId });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);
    expect(context.getField("username")).to.equal(null);
    expect(context.getField(fieldId)).to.be.an("object");
    expect(context.getField(fieldId)).to.have.property("id", fieldId);
  });
}