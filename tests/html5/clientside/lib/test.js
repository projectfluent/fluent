(function() {
    var jasmineEnv = jasmine.getEnv();
    var reporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(reporter);
    document.addEventListener("DOMContentLoaded", function() {
        var ctx = document.l10nCtx;
        ctx.onReady = function() {
            jasmineEnv.execute();
        };
    });
})();
