import fs from "fs";
import readline from "readline";
import parse_args from "minimist";
import {Resource} from "../syntax/grammar.mjs";

const argv = parse_args(process.argv.slice(2), {
    boolean: ["help"],
    alias: {
        help: "h",
    },
});

if (argv.help) {
    exit_help(0);
}

const [file_path] = argv._;

if (file_path === "-") {
    parse_stdin();
} else if (file_path) {
    parse_file(file_path);
} else {
    exit_help(1);
}

function exit_help(exit_code) {
    console.log(`
    Usage: node --experimental-modules parse.mjs [OPTIONS] <FILE>

    When FILE is "-", read text from stdin.

    Examples:

        node --experimental-modules parse.mjs path/to/file.ftl
        cat path/to/file.ftl | node --experimental-modules parse.mjs -

    Options:

        -h, --help      Display help and quit.
`);
    process.exit(exit_code);
}

function parse_stdin() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "fluent>",
    });

    const lines = [];

    rl.on("line", line => lines.push(line));
    rl.on("close", () =>
        parse(lines.join("\n") + "\n"));
}

function parse_file(file_path) {
    fs.readFile(file_path, "utf8", (err, content) => {
        if (err) {
            throw err;
        }

        parse(content);
    });
}


function parse(ftl) {
    Resource.run(ftl).fold(
        ast => console.log(JSON.stringify(ast, null, 4)),
        err => console.error(err));
}
