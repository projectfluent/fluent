describe("Localization", function() {
  it("test sentence should be 'Test sentence'", function() {
    var node = document.querySelector('[l10n-id="test"]');
    expect(node.textContent).toEqual('Test sentence');
  });
});
describe("JS API", function() {
  it("value from context should be 'Test sentence'", function() {
    expect(getEntity('test')).toEqual('Test sentence');
  });
});
