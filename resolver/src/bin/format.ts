import fs from "fs";
import readline from "readline";
import parseArgs from "minimist";
import {Resource as ResourceParser} from "../lib/parser";
import {Resource} from "../ast";
import {Bundle} from "../bundle";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help"],
    alias: {
        help: "h",
    },
});

if (argv.help) {
    exitHelp(0);
}

const [filePath] = argv._;

if (filePath === "-") {
    parseStdin();
} else if (filePath) {
    parseFile(filePath);
} else {
    exitHelp(1);
}

function exitHelp(exitCode: number) {
    console.log(`
    Usage: node --experimental-modules parse.mjs [OPTIONS] <FILE>

    When FILE is "-", read text from stdin.

    Examples:

        node --experimental-modules parse.mjs path/to/file.ftl
        cat path/to/file.ftl | node --experimental-modules parse.mjs -

    Options:

        -h, --help      Display help and quit.
`);
    process.exit(exitCode);
}

function parseFluent(source: string) {
    return ResourceParser.run(source).fold(
        resource => resource,
        err => {
            throw err;
        }
    );
}

function format(resource: Resource) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    for (let entry of resource.body) {
        let message = bundle.getMessage(entry.id.name);
        if (message) {
            let {value, errors} = bundle.formatValue(message, new Map());
            console.log(value);
            console.log(errors);
        }
    }
}

function parseStdin() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "fluent>",
    });

    let lines: Array<string> = [];

    rl.on("line", line => lines.push(line));
    rl.on("close", () => parseFormat(lines.join("\n") + "\n"));
}

function parseFile(filePath: string) {
    fs.readFile(filePath, "utf8", (err: NodeJS.ErrnoException | null, content: string | Buffer) => {
        if (err) {
            throw err;
        }

        if (typeof content === "string") {
            parseFormat(content);
        }
    });
}

function parseFormat(source: string) {
    let resource = parseFluent(source);
    format(resource);
}
