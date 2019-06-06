import {test_fixtures, validate_as_json} from "../harness/fixture.js";
import {parseString, formatGroups} from "../../lib/tools.js";

const fixtures_dir = process.argv[2];

if (!fixtures_dir) {
    console.error("Usage: node -r esm test_fixtures.js FIXTURE");
    process.exit(1);
}

test_fixtures(fixtures_dir, (input: string, expected: string) => {
    let resource = parseString(input);
    let results = formatGroups(resource);
    validate_as_json(results, expected);
});
