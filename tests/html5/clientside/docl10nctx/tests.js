var utests = {
  'test': function(nodes) {
    var node = document.querySelectorAll('[l10n-id="test"]')[0];
    nodes.push(node);
    assertEquals(getEntity('test'), node.textContent); 
  },
}


