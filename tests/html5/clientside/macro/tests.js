var utests = {
  'name': function(nodes) {
    var name = document.querySelectorAll('[l10n-id="name"]')[0];
    nodes.push(name);
    assertEquals(name.textContent, 'Name');
  },
  'window_title': function(nodes) {
    var windowTitle = document.querySelectorAll('[l10n-id="window_title"]')[0];
    nodes.push(windowTitle);
    assertEquals(windowTitle.textContent, 'Downloading 5 files');
  },
  'name_input': function(nodes) {
    var nameInput = document.querySelectorAll('[l10n-id="name_input"]')[0];
    nodes.push(nameInput);
    assertEquals(nameInput.getAttribute('value'), "Maggie");
    assertEquals(nameInput.getAttribute('placeholder'), "Write your name Maggie");
    assertEquals(nameInput.getAttribute('title'), "You can give us your nickname if you prefer");
  },
  'download_status': function(nodes) {
    var span = document.querySelectorAll('[l10n-id="download_status"]')[0];
    nodes.push(span);
    assertEquals(span.textContent, 'Maggie is currently downloading 5 files.');
  },
  'mood': function(nodes) {
    var span = document.querySelectorAll('[l10n-id="mood"]')[0];
    nodes.push(span);
    assertEquals(span.textContent, "She's happy!");
  },
}


