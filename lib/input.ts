import fs from "fs";
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

export function fromFile(filePath: string, callback: (value: string) => void) {
    fs.readFile(filePath, "utf8", (err: NodeJS.ErrnoException | null, content: string | Buffer) => {
        if (err) {
            throw err;
        }

        if (typeof content === "string") {
            callback(content);
        }
    });
}
