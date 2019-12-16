import fs from "fs";
import assert from "assert";
import child_process from "child_process";
import * as FTL from "../syntax/ast.js";

const ABSTRACT = `${__dirname}/../syntax/abstract.js`;
const GRAMMAR = `${__dirname}/../syntax/grammar.js`;
const FIXTURES = `${__dirname}/fixtures`;

main();

function main() {
    let changed = modify_grammar();
    changed |= validate_selector();
    if (changed) {
        child_process.execSync("git diff syntax",  { stdio: "inherit" });
    }
    process.exit(Number(changed));
}

/**
 * Modify grammar.js
 *
 * The combinator parsers can cover multiple variants.
 * For example, `repeat()` is the same as `maybe(repeat1)`.
 * And `maybe()` is `not() or once()`.
 * Now, when you replace several options with just one, you should
 * get test failures.
 * In the same way, if you add options to a more restricted production,
 * you should also get test failures.
 */
function modify_grammar() {
    let changed = false;
    let grammar = fs.readFileSync(GRAMMAR, "utf8");
    let to_replace = /(not|maybe|repeat1?)\(/g;
    let m, iteration = 0;
    while (m = to_replace.exec(grammar)) {
        let replacement, replacements;
        switch (m[1]) {
            case "not":
                replacements = ["maybe"];
                break;
            case "maybe":
                replacements = ["not", "sequence"];
                break;
            case "repeat":
                if (iteration === 0) {
                    // skip Resource
                    replacements = [];
                } else {
                    replacements = ["repeat0", "repeat1"];
                }
                break;
            case "repeat1":
                let further = /repeat1/g;
                further.lastIndex = m.index + "repeat1".length;
                if (further.test(grammar)) {
                    replacements = ["repeat"];
                } else {
                    // ignore blank, which is the last production
                    replacements = [];
                }
                break;
        }
        for (replacement of replacements) {
            let new_grammar = grammar.slice(0, m.index);
            new_grammar += replacement;
            new_grammar += grammar.slice(m.index + m[1].length);
            fs.writeFileSync(GRAMMAR, new_grammar);
            console.log(`Grammar validation iteration ${++iteration}`);
            const keep_change = verify_fixtures();
            if (keep_change) {
                grammar = new_grammar;
                changed = true;
                console.log("new grammar");
                break;
            }
        }
    }
    fs.writeFileSync(GRAMMAR, grammar);
    return changed;
}

/**
 * Modify abstract.js
 *
 * Test if the constraints to selector expressions are all tested.
 * Invert existing instanceof checks, and allow more AST nodes
 * that can be returned by InlineExpression.
 */
function validate_selector() {
    let changed = false;
    let abstract = fs.readFileSync(ABSTRACT, "utf8");
    let expressions =
        Object.values(FTL)
        .filter(node => FTL.Expression.isPrototypeOf(node))
        .map(node => node.name);
    // This is a bit hacky, a Placeable can be a PatternElement and
    // an expression, and is only typed to be the former.
    expressions.push("Placeable");
    let chunks = abstract.split(/(^.*?selector_is_valid.*$)/m);
    assert.equal(chunks.length, 5);
    let head = chunks.slice(0, 2).join("");
    let valid_selector = chunks[2];
    let tail = chunks.slice(3).join("");
    assert.strictEqual([head, valid_selector, tail].join(""), abstract);
    // Literals are abstract, and SelectExpression can only appear
    // inside a Placeable.
    let m, iteration = 0, checked_types = ["Literal", "SelectExpression"];
    const instances = /selector instanceof FTL.([a-zA-Z]+)/g;
    while (m = instances.exec(valid_selector)) {
        checked_types.push(m[1]);
        let new_valid = valid_selector.replace(
            m[0],
            `!(selector instanceof FTL.${m[1]})`
        );
        fs.writeFileSync(ABSTRACT, [head, new_valid, tail].join(""));
        console.log(`Abstract validation iteration ${++iteration}`);
        const keep_change = verify_fixtures();
        if (keep_change) {
            valid_selector = new_valid;
            changed = true;
            console.log("new abstract");
        }
    }
    for (const node of expressions) {
        if (checked_types.includes(node)) {
            continue;
        }
        let new_valid = `
                    selector instanceof FTL.${node} ||${valid_selector}`;
        fs.writeFileSync(ABSTRACT, [head, new_valid, tail].join(""));
        console.log(`Abstract validation iteration ${++iteration}`);
        const keep_change = verify_fixtures();
        if (keep_change) {
            valid_selector = new_valid;
            changed = true;
            console.log("new abstract");
        }
    }
    fs.writeFileSync(ABSTRACT, [head, valid_selector, tail].join(""));
    return changed;
}

function verify_fixtures() {
    try {
        child_process.execSync("node -r esm --stack-size=500000000 test/parser.js --bail " + FIXTURES);
        return true;
    } catch(e) {
        return false;
    }
}
