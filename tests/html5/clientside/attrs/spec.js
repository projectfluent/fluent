describe("Localization", function() {
  it("name should be 'Name'", function() {
    var name = document.querySelector('[l10n-id="name"]');
    expect(name.textContent).toEqual('Name');
  });
  it("phone should be 'Phone'", function() {
    var phone = document.querySelector('[l10n-id="phone"]');
    expect(phone.textContent).toEqual('Phone');
  });
  it("address should be 'Address'", function() {
    var address = document.querySelector('[l10n-id="address"]');
    expect(address.textContent).toEqual('Address');
  });
  it("name_input title should be 'You can give us your nickname if you prefer'", function() {
    var node = document.querySelector('[l10n-id="name_input"]');
    expect(node.getAttribute('title')).toEqual('You can give us your nickname if you prefer');
  });
  it("name_input should be 'Write your name'", function() {
    var node = document.querySelector('[l10n-id="name_input"]');
    expect(node.getAttribute('placeholder')).toEqual('Write your name');
  });
  it("phone_input should be '(501) 650 231 800'", function() {
    var node = document.querySelector('[l10n-id="phone_input"]');
    expect(node.getAttribute('placeholder')).toEqual('(501) 650 231 800');
  });
  it("address_input should be '650 Castro St., Suite 300, MtV, CA'", function() {
    var node = document.querySelector('[l10n-id="address_input"]');
    expect(node.getAttribute('placeholder')).toEqual('650 Castro St., Suite 300, MtV, CA');
  });
});
