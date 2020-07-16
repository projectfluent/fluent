import {deepStrictEqual} from "assert";
import commonmark from "commonmark";
import jsonDiff from "json-diff";

type formatFn = (stdin: string) => string;

export function validate(fn: formatFn, spec: string, source: string) {
    // https://github.com/commonmark/commonmark.js/blob/master/README.md#usage
    let reader = new commonmark.Parser();
    let parsed = reader.parse(source);
    let walker = parsed.walker();

    let counter = 1;
    let actual = null;
    let current;
    while ((current = walker.next())) {
        let {entering, node} = current;
        if (entering && node.type === "code_block" && node.literal !== null) {
            if (node.info === "properties") {
                actual = fn(node.literal);
            } else if (node.info === "json" && actual) {
                let expected = node.literal;

                try {
                    deepStrictEqual(JSON.parse(actual), JSON.parse(expected));
                    console.log(`${spec} Example ${counter++} PASS`);
                } catch (err) {
                    console.log(`${spec} Example ${counter++} FAIL`);
                    console.log(jsonDiff.diffString(err.actual, err.expected));
                }
                actual = null;
            }
        }
    }
}
