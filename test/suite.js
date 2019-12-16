import assert from "assert";
import {diffString} from "json-diff";
import color from "cli-color";

export const PASS = color.green("PASS");
export const FAIL = color.red("FAIL");

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

export function print_generic_error(ftl_path, err) {
    console.log(`
========================================================================
${FAIL} ${ftl_path}
------------------------------------------------------------------------
${err.message}
`);
}

export function print_assert_error(title, err) {
    console.log(`
========================================================================
${FAIL} ${title}
------------------------------------------------------------------------
${diffString(err.expected, err.actual)}
`);
}

export function exit_summary(error_count) {
    const message = error_count
        ? `Tests ${FAIL}: ${error_count}.`
        : `All tests ${PASS}.`;
    console.log(`
========================================================================
${message}
`);
    process.exit(Number(error_count > 0));
}
