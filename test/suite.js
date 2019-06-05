import assert from "assert";
import color from "cli-color";
import {diff, PASS, FAIL} from "./util.js";

export default function suite(fn) {
    let errors = new Map();
    fn(create_tester(errors));

    if (errors.size > 0) {
        for (let [err, title] of errors) {
            print_assert_error(title, err);
        }
    }

    exit_summary(errors.size);
}

function create_tester(errors) {
    return {
        ...assert,
        deep_equal(title, actual, expected) {
            try {
                assert.deepEqual(actual, expected);
                console.log(`${title} ${PASS}`);
            } catch (err) {
                if (err instanceof assert.AssertionError) {
                    console.log(`${title} ${FAIL}`);
                    errors.set(err, title);
                } else {
                    throw err;
                }
            }
        },
    };
}

function print_assert_error(title, err) {
    console.log(`
========================================================================
${FAIL} ${title}
------------------------------------------------------------------------
${diff(err.expected, err.actual)}
`);
}

function exit_summary(error_count) {
    const message = error_count ? `Tests ${FAIL}: ${error_count}.` : `All tests ${PASS}.`;
    console.log(`
========================================================================
${message}
`);
    process.exit(Number(error_count > 0));
}
