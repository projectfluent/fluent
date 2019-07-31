import parseArgs from "minimist";
import {Resource} from "../format/resource";
import {fromFile, fromStdin} from "../lib/input";
import {formatResource} from "../lib/tools";

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
`);
    process.exit(exitCode);
}

function print(source: string) {
    let resource = new Resource(source);
    let results = formatResource(resource, new Map());
    console.log(JSON.stringify(results, null, 4));
}
