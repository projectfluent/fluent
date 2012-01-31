describe("localization", function() {
  it("title should be 'Downloading 5 files'", function() {
    var node = document.querySelector('[l10n-id="window_title"]');
    expect(node.textContent).toEqual('Downloading 5 files');
  });
  it("input label should be 'Name'", function() {
    var node = document.querySelector('[l10n-id="name"]');
    expect(node.textContent).toEqual('Name');
  });
  it("input value should be 'Maggie'", function() {
    var node = document.querySelector('[l10n-id="name_input"]');
    expect(node.getAttribute('value')).toEqual('Maggie');
  });
  it("input placeholder should be 'Write your name Maggie'", function() {
    var node = document.querySelector('[l10n-id="name_input"]');
    expect(node.getAttribute('placeholder')).toEqual('Write your name Maggie');
  });
  it("input title should be 'You can give us your nickname if you prefer'", function() {
    var node = document.querySelector('[l10n-id="name_input"]');
    expect(node.getAttribute('title')).toEqual('You can give us your nickname if you prefer');
  });
  it("download status should be 'Mark is currently downloading 5 files.'", function() {
    var node = document.querySelector('[l10n-id="download_status"]');
    expect(node.textContent).toEqual('Mark is currently downloading 5 files.');
  });
  it("mood message should be 'She's happy!'", function() {
    var node = document.querySelector('[l10n-id="mood"]');
    expect(node.textContent).toEqual('She\'s happy!');
  });
});

describe("retranslation", function() {
  beforeEach(function() {
    var button = document.getElementsByTagName('button')[0];
    button.click();
  });
  afterEach(function() {
    var mood = document.querySelector('[l10n-id="mood"]');
    mood.innerHTML = "She's happy!";
  });

  it("mood message should be 'He's happy!'", function() {
    var mood = document.querySelector('[l10n-id="mood"]');
    expect(mood.textContent).toEqual('He\'s happy!');
  });
});
