var utests = {
  'name': function(nodes) {
    var name = document.querySelectorAll('[l10n-id="name"]')[0];
    nodes.push(name);
    assertEquals(name.textContent, 'Name');
  },
  'phone': function(nodes) {
    var phone = document.querySelectorAll('[l10n-id="phone"]')[0];
    nodes.push(phone);
    assertEquals(phone.textContent, 'Phone');
  },
  'address': function(nodes) {
    var address = document.querySelectorAll('[l10n-id="address"]')[0];
    nodes.push(address);
    assertEquals(address.textContent, 'Address');
  },
}
