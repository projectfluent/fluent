import parseArgs from "minimist";
import {fromFile, fromStdin} from "../lib/input";
import {formatMessage, formatResource} from "../lib/tools";
import {Resource} from "../resolver/resource";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help"],
    string: ["message"],
    alias: {
        help: "h",
        message: "m",
    },
});

if (argv.help) {
    exitHelp(0);
}

const [filePath] = argv._;

if (filePath === "-") {
    fromStdin(print);
} else if (filePath) {
    fromFile(filePath, print);
} else {
    exitHelp(1);
}

function exitHelp(exitCode: number) {
    console.log(`
    Usage: node format.js [OPTIONS] <FILE>

    When FILE is "-", read text from stdin.

    Examples:

        node format.js path/to/file.ftl
        cat path/to/file.ftl | node format.js -

    Options:

        -h, --help         Display help and quit.
        -m, --message ID   Format only the message called ID.
`);
    process.exit(exitCode);
}

function print(source: string) {
    let resource = new Resource(source);
    let results;
    if (argv.message) {
        results = formatMessage(resource, new Map(), argv.message);
    } else {
        results = formatResource(resource, new Map());
    }
    console.log(JSON.stringify(results, null, 4));
}
