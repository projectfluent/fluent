var tests = [];

function assertEquals(val1, val2) {
  if (val1 != val2)
    throw "exception";
}

document.addEventListener("DOMContentLoaded", function() {
  var ctx = document.l10nCtx;
  ctx.onReady = runTests;
});

function runTests() {
  for (var i in utests) {
    var nodesAffected = [];
    try {
      utests[i](nodesAffected);
      for (var i in nodesAffected) {
        nodesAffected[i].style.outline = "1px solid #bfb";
        nodesAffected[i].style.color = '#090';
      }
      var error = false;
    } catch(e) {
      for (var i in nodesAffected) {
        nodesAffected[i].style.outline = "1px solid #fbb";
        nodesAffected[i].style.color = '#900';
      }
      tests.push(false);
      error = true;
    }
    if (!error) {
      tests.push(true);
    }
  }
  showResults();
}

function showResults() {
  var body = document.body;
  var br = document.createElement('br');
  var span = document.createElement('span');

  var total = tests.length;
  var passed = 0;
  var failed = 0;
  for (var i in tests) {
    if (tests[i])
      passed += 1;
    else
      failed += 1;
  }
  var color;
  if (passed == total)
    color = '#dfd';
  else
    color = '#fdd';
  span.setAttribute('style', "background-color: "+color+"; margin-top: 40px; display: inline-block; padding: 5px;");
  if (failed)
    var textFailed = ", Tests failed: "+failed+"/"+total;
  else
    var textFailed = "";
  var text =  "Tests passed: "+passed+"/"+total+textFailed; 

  span.innerHTML = text;
  body.appendChild(br);
  body.appendChild(span);
}
