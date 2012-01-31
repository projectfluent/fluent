describe("First translation", function() {
  it("payload should be green", function() {
    var node = document.querySelectorAll('#progress1 span')[1];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
  });
  it("time should be red", function() {
    var node = document.querySelectorAll('#progress1 span')[0];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
  });
});
describe("Retranslation", function() {
  var buffer;
  beforeEach(function() {
    var node = document.querySelector('#progress1');
    buffer = node.innerHTML;
    var button = document.querySelector('button');
    button.click();
  });
  afterEach(function() {
    var node = document.querySelector('#progress1');
    node.innerHTML = buffer;
    document.l10nData['kilobytes1'] = 0;
    document.l10nData['timeremaining1'] = 60;
  });
  it("payload should still be green", function() {
    var node = document.querySelectorAll('#progress1 span')[1];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
  });
  it("time should still be red", function() {
    var node = document.querySelectorAll('#progress1 span')[0];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
  });
});
