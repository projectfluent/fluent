var utests = {
  'name': function(nodes) {
    var name = document.querySelectorAll('[l10n-id="test"]')[0];
    nodes.push(name);
    assertEquals(name.getAttribute('value'), 'passed');
    assertEquals(name.getAttribute('title'), 'color should be green');
    assertEquals(name.getAttribute('style'), 'color:green');
  },
}
