import {Pattern} from "../../syntax/parser/ast.js";
import {ScopeError} from "./error.js";
import {Message} from "./message.js";
import {Resource} from "./resource.js";
import {Scope} from "./scope.js";
import {Value} from "./value.js";

export interface FormatResult {
    readonly value: string;
    readonly errors: Array<ScopeError>;
}

export class Bundle {
    public readonly messages: Map<string, Message> = new Map();

    addResource(resource: Resource) {
        for (let message of resource.body) {
            if (message.type === "Message") {
                let attributes: Record<string, Pattern> = {};
                for (let attribute of message.attributes) {
                    attributes[attribute.id.name] = attribute.value;
                }
                this.messages.set(message.id.name, <Message>{
                    id: message.id.name,
                    value: message.value,
                    attributes,
                });
            }
        }
    }

    hasMessage(id: string) {
        return this.messages.has(id);
    }

    getMessage(id: string) {
        return this.messages.get(id);
    }

    formatPattern(pattern: Pattern, variables: Map<string, Value>): FormatResult {
        let scope = new Scope(this.messages, variables);
        let value = scope.resolvePattern(pattern).format(scope);
        return {value, errors: scope.errors};
    }
}
