import fs from "fs";
import readline from "readline";
import parse_args from "minimist";
import ebnf from "../lib/ebnf.js";

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
    from_stdin();
} else if (file_path) {
    from_file(file_path);
} else {
    exit_help(1);
}

function exit_help(exit_code) {
    console.log(`
    Usage: node -r esm ebnf.js [OPTIONS] <FILE>

    When FILE is "-", read text from stdin.

    Examples:

        node -r esm ebnf.js path/to/grammar.js
        cat path/to/grammar.js | node -r esm ebnf.js -

    Options:

        -h, --help      Display help and quit.
`);
    process.exit(exit_code);
}

function from_stdin() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "fluent>",
    });

    const lines = [];

    rl.on("line", line => lines.push(line));
    rl.on("close", () =>
        print_ebnf(lines.join("\n") + "\n"));
}

function from_file(file_path) {
    fs.readFile(file_path, "utf8", (err, content) => {
        if (err) {
            throw err;
        }

        print_ebnf(content);
    });
}

function print_ebnf(source) {
    // Each EBNF rule already ends with \n.
    process.stdout.write(ebnf(source));
}
