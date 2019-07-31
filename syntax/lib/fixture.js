import assert from "assert";
import path from "path";
import {readdir, readfile, diff, PASS, FAIL} from "./util.js";

export async function test_fixtures(fixtures_dir, compare_fn) {
    if (fixtures_dir.endsWith(".ftl")) {
        // Actually, this is a filepath, split the path and the dir.
        var ftls = [path.basename(fixtures_dir)];
        fixtures_dir = path.dirname(fixtures_dir);
    } else {
        let files = await readdir(fixtures_dir);
        var ftls = files.filter(filename => filename.endsWith(".ftl"));
    }

    // Collect all AssertionErrors.
    const errors = new Map();

    // Parse each FTL fixture and compare against the expected AST.
    for (const file_name of ftls) {
        const ftl_path = path.join(fixtures_dir, file_name);
        const res_path = ftl_path.replace(/ftl$/, "json");

        process.stdout.write(`${ftl_path} `);

        try {
            var ftl_source = await readfile(ftl_path);
            var expected_result = await readfile(res_path);
        } catch (err) {
            errors.set(ftl_path, err);
            console.log(FAIL);
            continue;
        }

        try {
            compare_fn(ftl_source, expected_result);
            console.log(PASS);
        } catch (err) {
            errors.set(ftl_path, err);
            console.log(FAIL);
        }
    }

    // Print all errors.
    for (const [ftl_path, err] of errors) {
        if (err instanceof assert.AssertionError) {
            print_assert_error(ftl_path, err);
        } else {
            print_generic_error(ftl_path, err);
        }
    }

    exit_summary(errors.size);
}

export function validate_json(actual_ast, expected_serialized) {
    const actual_json = JSON.parse(JSON.stringify(actual_ast));
    const expected_json = JSON.parse(expected_serialized);
    assert.deepEqual(actual_json, expected_json);
}

function print_assert_error(ftl_path, err) {
    console.log(`
========================================================================
${FAIL} ${ftl_path}
------------------------------------------------------------------------
${diff(err.expected, err.actual)}
`);
}

function print_generic_error(ftl_path, err) {
    console.log(`
========================================================================
${FAIL} ${ftl_path}
------------------------------------------------------------------------
${err.message}
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
