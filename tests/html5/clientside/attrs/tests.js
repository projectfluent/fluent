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
  'name_input': function(nodes) {
    var nameInput = document.querySelectorAll('[l10n-id="name_input"]')[0];
    nodes.push(nameInput);
    assertEquals(nameInput.getAttribute('title'), 'You can give us your nickname if you prefer');
    assertEquals(nameInput.getAttribute('placeholder'), 'Write your name');
  },
  'phone_input': function(nodes) {
    var phoneInput = document.querySelectorAll('[l10n-id="phone_input"]')[0];
    nodes.push(phoneInput);
    assertEquals(phoneInput.getAttribute('placeholder'), '(501) 650 231 800');
  },
  'address_input': function(nodes) {
    var addressInput = document.querySelectorAll('[l10n-id="address_input"]')[0];
    nodes.push(addressInput);
    assertEquals(addressInput.getAttribute('placeholder'), '650 Castro St., Suite 300, MtV, CA');
  },
}

