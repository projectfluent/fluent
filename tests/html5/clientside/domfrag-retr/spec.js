describe("Example 1", function() {
  describe("First translation", function() {
    it("title should be '0 MB (megabajtów)'", function() {
      var node = document.querySelector('#progress1 span');
      expect(node.getAttribute('title')).toEqual('0 MB (megabajtów)');
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress1 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
  describe("Retranslation", function() {
    var buffer;
    beforeEach(function() {
      var node = document.querySelector('#progress1');
      buffer = node.innerHTML;
      var button = document.querySelectorAll('button')[0];
      button.click();
    });
    afterEach(function() {
      var node = document.querySelector('#progress1');
      node.innerHTML = buffer;
      document.l10nData['kilobytes1'] = 0;
    });
    it("title should be '0.125 MB (megabajtów)'", function() {
      var node = document.querySelector('#progress1 span');
      expect(node.getAttribute('title')).toEqual('0.125 MB (megabajtów)');
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress1 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
});

describe("Example 2", function() {
  describe("First translation", function() {
    it("title should be gone", function() {
      var node = document.querySelector('#progress2 span');
      expect(node.getAttribute('title')).toBeNull();
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress2 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
  describe("Retranslation", function() {
    var buffer;
    beforeEach(function() {
      var node = document.querySelector('#progress2');
      buffer = node.innerHTML;
      var button = document.querySelectorAll('button')[1];
      button.click();
    });
    afterEach(function() {
      var node = document.querySelector('#progress2');
      node.innerHTML = buffer;
      document.l10nData['kilobytes2'] = 0;
    });
    it("title should be gone", function() {
      var node = document.querySelector('#progress2 span');
      expect(node.getAttribute('title')).toBeNull();
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress2 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
});

describe("Example 3", function() {
  describe("First translation", function() {
    it("title should be '0 MB (megabajtów)'", function() {
      var node = document.querySelector('#progress3 span');
      expect(node.getAttribute('title')).toEqual('0 MB (megabajtów)');
    });
    it("payload should be red", function() {
      var node = document.querySelector('#progress3 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
    });
  });
  describe("Retranslation", function() {
    var buffer;
    beforeEach(function() {
      var node = document.querySelector('#progress3');
      buffer = node.innerHTML;
      var button = document.querySelectorAll('button')[2];
      button.click();
    });
    afterEach(function() {
      var node = document.querySelector('#progress3');
      node.innerHTML = buffer;
      document.l10nData['kilobytes3'] = 0;
    });
    it("title should be '0.125 MB (megabajtów)'", function() {
      var node = document.querySelector('#progress3 span');
      expect(node.getAttribute('title')).toEqual('0.125 MB (megabajtów)');
    });
    it("payload should be red", function() {
      var node = document.querySelector('#progress3 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(255, 0, 0)');
    });
  });
});

describe("Example 4", function() {
  describe("First translation", function() {
    it("title should be '{{ kilobytes4 / 1024 }} MB'", function() {
      var node = document.querySelector('#progress4 span');
      expect(node.getAttribute('title')).toEqual('{{ kilobytes4 / 1024 }} MB');
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress4 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
  describe("Retranslation", function() {
    var buffer;
    beforeEach(function() {
      var node = document.querySelector('#progress4');
      buffer = node.innerHTML;
      var button = document.querySelectorAll('button')[3];
      button.click();
    });
    afterEach(function() {
      var node = document.querySelector('#progress4');
      node.innerHTML = buffer;
      document.l10nData['kilobytes4'] = 0;
    });
    it("title should be '{{ kilobytes4 / 1024 }} MB'", function() {
      var node = document.querySelector('#progress4 span');
      expect(node.getAttribute('title')).toEqual('{{ kilobytes4 / 1024 }} MB');
    });
    it("payload should be green", function() {
      var node = document.querySelector('#progress4 span');
      var css = window.getComputedStyle(node);
      expect(css.getPropertyValue('color')).toEqual('rgb(0, 128, 0)');
    });
  });
});
