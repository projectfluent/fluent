describe("Localization", function() {
  it("value should be 'passed'", function() {
    var node = document.querySelector('[l10n-id="test"]');
    expect(node.getAttribute('value')).toEqual('passed');
  });
  it("title should be 'color should be green'", function() {
    var node = document.querySelector('[l10n-id="test"]');
    expect(node.getAttribute('title')).toEqual('color should be green');
  });
  it("style should be 'color:green'", function() {
    var node = document.querySelector('[l10n-id="test"]');
    expect(node.getAttribute('style')).toEqual('color:green');
  });
});
