import * as assert from "assert";
import {Bundle} from "../../format/bundle";
import {ErrorKind, ScopeError} from "../../format/error";
import {Resource} from "../../format/resource";
import {StringValue} from "../../format/value";

suite("Sample suite", function() {
    let bundle: Bundle;

    suiteSetup(function() {
        bundle = new Bundle();
        bundle.addResource(
            new Resource(`
hello = Hello, {$world}
exclamation = {hello}!
select = {$selector ->
   *[a] (a) {hello}
    [b] (b) {exclamation}
}
`)
        );
    });

    test("hello with a variable", function() {
        let message = bundle.getMessage("hello");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    world: new StringValue("World"),
                })
            )
        );
        assert.equal(value, "Hello, World");
        assert.equal(errors.length, 0);
    });

    test("hello without a variable", function() {
        let message = bundle.getMessage("hello");
        let {value, errors} = bundle.formatPattern(message!.value!, new Map());
        assert.equal(value, "Hello, {$world}");
        assert.equal(errors.length, 1);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
    });

    test("exclamation with a variable", function() {
        let message = bundle.getMessage("exclamation");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    world: new StringValue("World"),
                })
            )
        );
        assert.equal(value, "Hello, World!");
        assert.equal(errors.length, 0);
    });

    test("exclamation without a variable", function() {
        let message = bundle.getMessage("exclamation");
        let {value, errors} = bundle.formatPattern(message!.value!, new Map());
        assert.equal(value, "Hello, {$world}!");
        assert.equal(errors.length, 1);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
    });

    test("select [a] with a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    world: new StringValue("World"),
                    selector: new StringValue("a"),
                })
            )
        );
        assert.equal(value, "(a) Hello, World");
        assert.equal(errors.length, 0);
    });

    test("select [a] without a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    selector: new StringValue("a"),
                })
            )
        );
        assert.equal(value, "(a) Hello, {$world}");
        assert.equal(errors.length, 1);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
    });

    test("select [b] with a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    world: new StringValue("World"),
                    selector: new StringValue("b"),
                })
            )
        );
        assert.equal(value, "(b) Hello, World!");
        assert.equal(errors.length, 0);
    });

    test("select [b] without a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    selector: new StringValue("b"),
                })
            )
        );
        assert.equal(value, "(b) Hello, {$world}!");
        assert.equal(errors.length, 1);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
    });

    test("select default with a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(
            message!.value!,
            new Map(
                Object.entries({
                    world: new StringValue("World"),
                })
            )
        );
        assert.equal(value, "(a) Hello, World");
        assert.equal(errors.length, 1);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$selector"));
    });

    test("select default without a variable", function() {
        let message = bundle.getMessage("select");
        let {value, errors} = bundle.formatPattern(message!.value!, new Map());
        assert.equal(value, "(a) Hello, {$world}");
        assert.equal(errors.length, 2);
        assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$selector"));
        assert.deepEqual(errors[1], new ScopeError(ErrorKind.UnknownVariable, "$world"));
    });
});
