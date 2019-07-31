import * as assert from "assert";
import {Bundle} from "../../format/bundle";
import {Resource} from "../../format/resource";

suite("Sample suite", function() {
    let bundle: Bundle;

    suiteSetup(function() {
        bundle = new Bundle();
        bundle.addResource(
            new Resource(`
hello = Hello, world
exclamation = {hello}!
`)
        );
    });

    test("hello", function() {
        let message = bundle.getMessage("hello");
        let {value, errors} = bundle.formatPattern(message!.value!, new Map());
        assert.equal(value, "Hello, world");
        assert.equal(errors.length, 0);
    });

    test("exclamation", function() {
        let message = bundle.getMessage("exclamation");
        let {value, errors} = bundle.formatPattern(message!.value!, new Map());
        assert.equal(value, "Hello, world!");
        assert.equal(errors.length, 0);
    });
});
