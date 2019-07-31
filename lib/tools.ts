import {NodeType} from "../format/ast";
import {Bundle} from "../format/bundle";
import {ErrorKind} from "../format/error";
import {Resource} from "../format/resource";
import {Value} from "../format/value";

type Variables = Map<string, Value>;

export function formatResource(resource: Resource, variables: Variables) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    let results = [];
    for (let entry of resource.body) {
        if (entry.type !== NodeType.Message) {
            continue;
        }
        let message = bundle.getMessage(entry.id.name);
        if (message) {
            if (message.value) {
                let {value, errors} = bundle.formatPattern(message.value, variables);
                results.push({
                    value,
                    errors: errors.map(error => ({
                        kind: ErrorKind[error.kind],
                        arg: error.arg,
                    })),
                });
            }
        }
    }
    return results;
}
