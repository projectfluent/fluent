import suite from "../harness/suite.js";
import {StringLiteral, NumberLiteral} from "../../syntax/grammar.js";

if (process.argv.length > 2) {
    console.error("Usage: node -r esm literals.js");
    process.exit(1);
}

suite(tester => {
    let title = node => `${node.type} {value: "${node.value}"}`;
    let test = (result, expected) =>
        result.fold(node => tester.deep_equal(title(node), node.parse(), expected), tester.fail);

    // Unescape raw value of StringLiterals.
    {
        test(StringLiteral.run(`"abc"`), {value: "abc"});
        test(StringLiteral.run(`"\\""`), {value: '"'});
        test(StringLiteral.run(`"\\\\"`), {value: "\\"});

        // Unicode escapes.
        test(StringLiteral.run(`"\\u0041"`), {value: "A"});
        test(StringLiteral.run(`"\\\\u0041"`), {value: "\\u0041"});
        test(StringLiteral.run(`"\\U01F602"`), {value: "😂"});
        test(StringLiteral.run(`"\\\\U01F602"`), {value: "\\U01F602"});

        // Trailing "00" are part of the literal values.
        test(StringLiteral.run(`"\\u004100"`), {value: "A00"});
        test(StringLiteral.run(`"\\U01F60200"`), {value: "😂00"});

        // Literal braces.
        test(StringLiteral.run(`"{"`), {value: "{"});
        test(StringLiteral.run(`"}"`), {value: "}"});
    }

    // Parse float value and precision of NumberLiterals.
    {
        // Integers.
        test(NumberLiteral.run("0"), {value: 0, precision: 0});
        test(NumberLiteral.run("1"), {value: 1, precision: 0});
        test(NumberLiteral.run("-1"), {value: -1, precision: 0});
        test(NumberLiteral.run("-0"), {value: 0, precision: 0});

        // Padded integers.
        test(NumberLiteral.run("01"), {value: 1, precision: 0});
        test(NumberLiteral.run("-01"), {value: -1, precision: 0});
        test(NumberLiteral.run("00"), {value: 0, precision: 0});
        test(NumberLiteral.run("-00"), {value: 0, precision: 0});

        // Positive floats.
        test(NumberLiteral.run("0.0"), {value: 0, precision: 1});
        test(NumberLiteral.run("0.01"), {value: 0.01, precision: 2});
        test(NumberLiteral.run("1.03"), {value: 1.03, precision: 2});
        test(NumberLiteral.run("1.000"), {value: 1, precision: 3});

        // Negative floats.
        test(NumberLiteral.run("-0.01"), {value: -0.01, precision: 2});
        test(NumberLiteral.run("-1.03"), {value: -1.03, precision: 2});
        test(NumberLiteral.run("-0.0"), {value: 0, precision: 1});
        test(NumberLiteral.run("-1.000"), {value: -1, precision: 3});

        // Padded floats.
        test(NumberLiteral.run("01.03"), {value: 1.03, precision: 2});
        test(NumberLiteral.run("1.0300"), {value: 1.03, precision: 4});
        test(NumberLiteral.run("01.0300"), {value: 1.03, precision: 4});
        test(NumberLiteral.run("-01.03"), {value: -1.03, precision: 2});
        test(NumberLiteral.run("-1.0300"), {value: -1.03, precision: 4});
        test(NumberLiteral.run("-01.0300"), {value: -1.03, precision: 4});
    }
});
