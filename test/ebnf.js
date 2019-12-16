import fs from "fs";
import color from "cli-color";
import difflib from "difflib";
import ebnf from "../lib/ebnf.js";
import {PASS, FAIL} from "./suite.js";

let args = process.argv.slice(2);

if (args.length !== 2) {
    console.error(
        "Usage: node -r esm ebnf.js " +
        "GRAMMAR_FILE EXPECTED_EBNF");
    process.exit(1);
}

main(...args);

function main(grammar_mjs, fluent_ebnf) {
    let grammar_source = fs.readFileSync(grammar_mjs, "utf8");
    let grammar_ebnf = fs.readFileSync(fluent_ebnf, "utf8");

    let diffs = difflib.unifiedDiff(
        lines(grammar_ebnf),
        lines(ebnf(grammar_source)), {
            fromfile: "Expected",
            tofile: "Actual",
        });

    for (let diff of diffs) {
        if (diff.startsWith("+")) {
            process.stdout.write(color.green(diff));
        } else if (diff.startsWith("-")) {
            process.stdout.write(color.red(diff));
        } else {
            process.stdout.write(diff);
        }
    }

    if (diffs.length === 0) {
        console.log(format_summary(PASS));
        process.exit(0);
    } else {
        console.log(format_summary(FAIL));
        process.exit(1);
    }
}

function lines(text) {
    return text.split("\n").map(line => line + "\n");
}

function format_summary(result) {
    return `
========================================================================
Generated EBNF ${result}.
`;
}
