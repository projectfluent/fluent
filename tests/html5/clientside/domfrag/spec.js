describe("First paragraph", function() {
  it("z (from) should be green", function() {
    var node = document.querySelectorAll('strong')[3];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
  });
  it("mistrzem! (rock!) should be red", function() {
    var node = document.querySelectorAll('em')[1];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
  });
  it("should be underlined", function() {
    var node = document.querySelectorAll('p')[2];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('text-decoration')).toEqual('underline');
  });
});
describe("Second paragraph", function() {
  it("z (from) should be green", function() {
    var node = document.querySelectorAll('strong')[5];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
  });
  it("mistrzem! (rock!) should be red", function() {
    var node = document.querySelectorAll('em')[2];
    var css = window.getComputedStyle(node);
    expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
  });
});
