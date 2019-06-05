import parseArgs from "minimist";
import {fromStdin, fromFile} from "./input";
import {Resource as ResourceParser} from "../lib/parser";
import {Resource, NodeType, GroupComment} from "../ast";
import {Bundle} from "../bundle";
import {ErrorKind} from "../error";
import {Value, StringValue, NumberValue} from "../value";

const argv = parseArgs(process.argv.slice(2), {
    boolean: ["help", "group"],
    alias: {
        help: "h",
        group: "g",
    },
});

if (argv.help) {
    exitHelp(0);
}

const [filePath] = argv._;

if (filePath === "-") {
    fromStdin(print);
} else if (filePath) {
    fromFile(filePath, print);
} else {
    exitHelp(1);
}

function exitHelp(exitCode: number) {
    console.log(`
    Usage: node format.js [OPTIONS] <FILE>

    When FILE is "-", read text from stdin.

    Examples:

        node format.js path/to/file.ftl
        cat path/to/file.ftl | node format.js -

    Options:

        -h, --help      Display help and quit.
        -g, --group     Treat each group as a separate resource.
`);
    process.exit(exitCode);
}

function print(source: string) {
    if (argv.group) {
        printGroups(source);
    } else {
        printAll(source);
    }
}

function parseString(source: string) {
    return ResourceParser.run(source).fold(
        resource => resource,
        err => {
            throw err;
        }
    );
}

type Variables = Map<string, Value>;

function formatResource(resource: Resource, variables: Variables) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    let results = [];
    for (let entry of resource.body) {
        if (entry.type !== NodeType.Message) {
            continue;
        }
        let message = bundle.getMessage(entry.id.name);
        if (message) {
            let {value, errors} = bundle.formatValue(message, variables);
            results.push({
                value,
                errors: errors.map(error => ({
                    kind: ErrorKind[error.kind],
                    arg: error.arg,
                })),
            });
        }
    }
    return results;
}

function printAll(source: string) {
    let resource = parseString(source);
    let results = formatResource(resource, new Map());
    console.log(JSON.stringify(results, null, 4));
}

interface Group {
    resource: Resource;
    variables: Map<string, Value>;
}

const RE_VARIABLE = /^\$([a-zA-Z]*): (string|number) = (.*)$/gm;
function parseVariables(comment: GroupComment) {
    let variables = new Map();
    let match;
    while ((match = RE_VARIABLE.exec(comment.content))) {
        let [, name, type, value] = match;
        switch (type) {
            case "string":
                variables.set(name, new StringValue(value));
                break;
            case "number":
                variables.set(name, new NumberValue(parseFloat(value)));
                break;
        }
    }
    return variables;
}

function printGroups(source: string) {
    let resource = parseString(source);

    let groups: Array<Group> = [];
    for (let entry of resource.body) {
        if (entry.type === NodeType.GroupComment) {
            groups.push({
                resource: {
                    type: NodeType.Resource,
                    body: [],
                },
                variables: parseVariables(entry),
            });
        } else if (groups.length > 0) {
            let currentGroup = groups[groups.length - 1];
            currentGroup.resource.body.push(entry);
        }
    }

    let results = [];
    for (let group of groups) {
        let groupResults = formatResource(group.resource, group.variables);
        let lastResult = groupResults.pop();
        results.push(lastResult);
    }

    console.log(JSON.stringify(results, null, 4));
}
