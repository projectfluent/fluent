import assert from "assert";
import { Resource } from "../../syntax/parser/grammar.js";
import { test_fixtures, validate_json } from "../lib/fixture.js";

const fixtures_dir = process.argv[2];

if (!fixtures_dir) {
    console.error("Usage: node parser.js FIXTURE");
    process.exit(1);
}

test_fixtures(fixtures_dir, (ftl_source, expected_ast) => {
    Resource.run(ftl_source).fold(
        ast => {
            validate_json(ast, expected_ast);
        },
        err => assert.fail(err)
    );
});
