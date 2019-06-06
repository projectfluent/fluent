import parseArgs from "minimist";
import {fromStdin, fromFile} from "../lib/input";
import {formatGroups, formatResource, parseString} from "../lib/tools";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help", "group"],
    alias: {
        help: "h",
        group: "g",
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

        -h, --help      Display help and quit.
        -g, --group     Treat each group as a separate resource.
`);
    process.exit(exitCode);
}

function print(source: string) {
    let resource = parseString(source);
    if (argv.group) {
        let results = formatGroups(resource);
        console.log(JSON.stringify(results, null, 4));
    } else {
        let results = formatResource(resource, new Map());
        console.log(JSON.stringify(results, null, 4));
    }
}
