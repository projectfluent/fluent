import parseArgs from "minimist";
import {fromFile} from "../lib/input";
import {validate} from "../lib/validate";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help"],
    alias: {
        help: "h",
    },
});

let [exePath, mdPath] = argv._;
if (exePath && mdPath) {
    fromFile(mdPath, source => validate(exePath, mdPath, source));
} else if (argv.help) {
    exitHelp(0);
} else {
    exitHelp(1);
}

function exitHelp(exitCode: number) {
    console.log(`
    Usage: node validate.js <EXECUTABLE> <SPEC>

    Examples:

        node validate.js build/bin/format.js spec/format/text_element.md

    Options:

        -h, --help      Display help and quit.
`);
    process.exit(exitCode);
}
