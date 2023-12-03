module.exports = {
  arguments: [],
  test: getFields,
};


function getFields(it, expect) {
  it("should return an empty array if no field has been added", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
  });

  it("should return added fields", function() {
    const context = this.test.context;

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(0);
    
    context.addField({ id: "firstname" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(1);

    context.addField({ id: "lastname" });
    context.addField({ id: "username" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(3);

    context.addField({ id: "email" });

    expect(context.getFields()).to.be.an("array");
    expect(context.getFields()).to.have.length(4);
  });
}