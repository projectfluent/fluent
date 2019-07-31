import {deepStrictEqual} from "assert";
import {execSync} from "child_process";
import {Parser as MarkdownParser} from "commonmark";
import {diffString} from "json-diff";

export function validate(exe: string, spec: string, source: string) {
    // https://github.com/commonmark/commonmark.js/blob/master/README.md#usage
    let reader = new MarkdownParser();
    let parsed = reader.parse(source);
    let walker = parsed.walker();

    let counter = 1;
    let actual = null;
    let current;
    while ((current = walker.next())) {
        let {entering, node} = current;
        if (entering && node.type === "code_block" && node.literal !== null) {
            if (node.info === "properties") {
                actual = execSync(exe, {
                    input: node.literal,
                    encoding: "utf8",
                });
            } else if (node.info === "json" && actual) {
                let expected = node.literal;

                try {
                    deepStrictEqual(JSON.parse(actual), JSON.parse(expected));
                    console.log(`${spec} Example ${counter++} PASS`);
                } catch (err) {
                    console.log(`${spec} Example ${counter++} FAIL`);
                    console.log(diffString(err.actual, err.expected));
                }
                actual = null;
            }
        }
    }
}
