import {execSync} from "child_process";
import parseArgs from "minimist";
import {files, fromFile} from "../lib/input.js";
import {validate} from "../lib/validate.js";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help"],
    alias: {
        help: "h",
    },
});

let [exePath, mdPath] = argv._;
if (exePath && mdPath) {
    for (let file of files(mdPath, ".md")) {
        let source = fromFile(file);
        validate(format, file, source);
    }
} else if (argv.help) {
    exitHelp(0);
} else {
    exitHelp(1);
}

function format(input: string) {
    return execSync(exePath, {
        input,
        encoding: "utf8",
    });
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
