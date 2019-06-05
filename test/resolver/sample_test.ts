import * as assert from "assert";
import {hello, exclamation, select} from "./fixtures";
import {Bundle} from "../../resolver/bundle";
import {StringValue} from "../../resolver/value";
import {ScopeError, ErrorKind} from "../../resolver/error";

suite("Sample suite", function() {
    suiteSetup(function() {
        this.bundle = new Bundle();
        this.bundle.addResource({
            body: [hello, exclamation, select],
        });
    });

    test("hello with a variable", function() {
        let message = this.bundle.getMessage("hello");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        world: new StringValue("World"),
                    })
                )
            );
            assert.equal(value, "Hello, World");
            assert.equal(errors.length, 0);
        }
    });

    test("hello without a variable", function() {
        let message = this.bundle.getMessage("hello");
        if (message) {
            let {value, errors} = this.bundle.formatValue(message, new Map());
            assert.equal(value, "Hello, {$world}");
            assert.equal(errors.length, 1);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
        }
    });

    test("exclamation with a variable", function() {
        let message = this.bundle.getMessage("exclamation");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        world: new StringValue("World"),
                    })
                )
            );
            assert.equal(value, "Hello, World!");
            assert.equal(errors.length, 0);
        }
    });

    test("exclamation without a variable", function() {
        let message = this.bundle.getMessage("exclamation");
        if (message) {
            let {value, errors} = this.bundle.formatValue(message, new Map());
            assert.equal(value, "Hello, {$world}!");
            assert.equal(errors.length, 1);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
        }
    });

    test("select [a] with a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        world: new StringValue("World"),
                        selector: new StringValue("a"),
                    })
                )
            );
            assert.equal(value, "(a) Hello, World");
            assert.equal(errors.length, 0);
        }
    });

    test("select [a] without a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        selector: new StringValue("a"),
                    })
                )
            );
            assert.equal(value, "(a) Hello, {$world}");
            assert.equal(errors.length, 1);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
        }
    });

    test("select [b] with a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        world: new StringValue("World"),
                        selector: new StringValue("b"),
                    })
                )
            );
            assert.equal(value, "(b) Hello, World!");
            assert.equal(errors.length, 0);
        }
    });

    test("select [b] without a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        selector: new StringValue("b"),
                    })
                )
            );
            assert.equal(value, "(b) Hello, {$world}!");
            assert.equal(errors.length, 1);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$world"));
        }
    });

    test("select default with a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(
                message,
                new Map(
                    Object.entries({
                        world: new StringValue("World"),
                    })
                )
            );
            assert.equal(value, "(a) Hello, World");
            assert.equal(errors.length, 1);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$selector"));
        }
    });

    test("select default without a variable", function() {
        let message = this.bundle.getMessage("select");
        if (message) {
            let {value, errors} = this.bundle.formatValue(message, new Map());
            assert.equal(value, "(a) Hello, {$world}");
            assert.equal(errors.length, 2);
            assert.deepEqual(errors[0], new ScopeError(ErrorKind.UnknownVariable, "$selector"));
            assert.deepEqual(errors[1], new ScopeError(ErrorKind.UnknownVariable, "$world"));
        }
    });
});
