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
});
