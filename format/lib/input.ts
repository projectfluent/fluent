import fs from "fs";
import path from "path";
import readline from "readline";

export function fromStdin(callback: (value: string) => void) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "fluent>",
    });

    let lines: Array<string> = [];

    rl.on("line", line => lines.push(line));
    rl.on("close", () => callback(lines.join("\n") + "\n"));
}

export function fromFile(filePath: string) {
    return fs.readFileSync(filePath, "utf8");
}

export function* files(destination: string, ext: string) {
    let files;
    if (destination.endsWith(ext)) {
        files = [destination];
    } else {
        files = fs
            .readdirSync(destination)
            .filter(filename => filename.endsWith(ext))
            .map(filename => path.join(destination, filename));
    }

    for (let file of files) {
        yield file;
    }
}
