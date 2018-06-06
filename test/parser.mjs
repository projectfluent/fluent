import assert from "assert";
import path from "path";
import {Resource} from "../syntax/grammar.mjs";
import {readdir, readfile, diff, PASS, FAIL} from "./util.mjs";

const fixtures_dir = process.argv[2];

if (!fixtures_dir) {
    console.error(
        "Usage: node --experimental-modules parser.mjs FIXTURES_DIR_OR_FTL");
    process.exit(1);
}

main(fixtures_dir);

async function main(fixtures_dir) {
    let files, ftls;
    if (fixtures_dir.endsWith(".ftl")) {
        // Actually, this is a filepath, split the path and the dir.
        ftls = [path.basename(fixtures_dir)];
        fixtures_dir = path.dirname(fixtures_dir);
    }
    else {
        files = await readdir(fixtures_dir);
        ftls = files.filter(
            filename => filename.endsWith(".ftl"));
    }

    // Collect all AssertionErrors.
    const errors = new Map();

    // Parse each FTL fixture and compare against the expected AST.
    for (const file_name of ftls) {
        const ftl_path = path.join(fixtures_dir, file_name);
        const ast_path = ftl_path.replace(/ftl$/, "json");

        process.stdout.write(`${ftl_path} `);

        try {
            var ftl_source = await readfile(ftl_path);
            var expected_ast = await readfile(ast_path);
        } catch (err) {
            errors.set(ftl_path, err);
            console.log(FAIL);
            continue;
        }

        Resource.run(ftl_source).fold(
            assert_equal,
            err => assert.fail(err));

        function assert_equal(ast) {
            try {
                validate(ast, expected_ast);
                console.log(PASS);
            } catch (err) {
                errors.set(ftl_path, err);
                console.log(FAIL);
            }
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

function validate(actual_ast, expected_serialized) {
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
    const message = error_count
        ? `Tests ${FAIL}: ${error_count}.`
        : `All tests ${PASS}.`;
    console.log(`
========================================================================
${message}
`);
    process.exit(Number(error_count > 0));
}
