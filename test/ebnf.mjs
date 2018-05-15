import color from "cli-color";
import difflib from "difflib";
import ebnf from "../lib/ebnf.mjs";
import {readfile, PASS, FAIL} from "./util.mjs";

let args = process.argv.slice(2);

if (args.length !== 2) {
    console.error(
        "Usage: node --experimental-modules ebnf.mjs " +
        "GRAMMAR_FILE EXPECTED_EBNF");
    process.exit(1);
}

main(...args);

async function main(grammar_mjs, fluent_ebnf) {
    let grammar_source = await readfile(grammar_mjs);
    let grammar_ebnf = await readfile(fluent_ebnf);

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
