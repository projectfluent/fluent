import {Bundle} from "../resolver/bundle.js";
import {ErrorKind} from "../resolver/error.js";
import {Resource} from "../resolver/resource.js";
import {Value} from "../resolver/value.js";

type Variables = Map<string, Value>;

export function formatResource(resource: Resource, variables: Variables) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    let results = [];
    for (let entry of resource.body) {
        if (entry.type !== "Message") {
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

export function formatMessage(resource: Resource, variables: Variables, id: string) {
    let bundle = new Bundle();
    bundle.addResource(resource);

    let message = bundle.getMessage(id);
    if (message && message.value) {
        return bundle.formatPattern(message.value, variables);
    }
}
