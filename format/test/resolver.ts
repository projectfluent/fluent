import {files, fromFile} from "../lib/input.js";
import {formatMessage} from "../lib/tools.js";
import {validate} from "../lib/validate.js";
import {Resource} from "../resolver/resource.js";

const specs = process.argv[2];

if (!specs) {
    console.error("Usage: node resolver.js SPEC");
    process.exit(1);
}

for (let file of files(specs, ".md")) {
    let source = fromFile(file);
    validate(format, file, source);
}

function format(input: string) {
    let resource = new Resource(input);
    let result = formatMessage(resource, new Map(), "test");
    return JSON.stringify(result, null, 4);
}
