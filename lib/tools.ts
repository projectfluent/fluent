import {Resource as ResourceParser} from "../syntax/grammar";
import {Resource, NodeType, GroupComment} from "../resolver/ast";
import {Bundle} from "../resolver/bundle";
import {ErrorKind} from "../resolver/error";
import {Value, StringValue, NumberValue} from "../resolver/value";

export function parseString(input: string) {
    return ResourceParser.run(input).fold(
        resource => resource,
        err => {
            throw err;
        }
    );
}

type Variables = Map<string, Value>;
type FormatResult = {
    value: string | null;
    errors: Array<{kind: string; arg: string}>;
};

export function formatResource(resource: Resource, variables: Variables) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    let results: Array<FormatResult> = [];
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
            } as FormatResult);
        }
    }
    return results;
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

export function formatGroups(resource: Resource) {
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

    let results: Array<FormatResult> = [];
    for (let group of groups) {
        let groupResults = formatResource(group.resource, group.variables);
        if (groupResults.length > 0) {
            let lastResult = groupResults[groupResults.length - 1];
            results.push(lastResult);
        }
    }

    return results;
}
