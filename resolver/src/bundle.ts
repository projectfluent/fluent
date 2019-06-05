import {Scope} from "./scope";
import {Value, NoneValue} from "./value";
import {Message} from "./message";
import {ScopeError} from "./error";
import {Resource} from "./ast";

export interface Formatted {
    readonly value: string | null;
    readonly errors: Array<ScopeError>;
}

export class Bundle {
    public readonly messages: Map<string, Message> = new Map();

    addResource(resource: Resource) {
        for (let message of resource.body) {
            this.messages.set(message.id.name, new Message(message));
        }
    }

    getMessage(id: string) {
        return this.messages.get(id);
    }

    private createScope(variables: Map<string, Value>) {
        return new Scope(this.messages, variables);
    }

    formatValue(message: Message, variables: Map<string, Value>): Formatted {
        let scope = this.createScope(variables);
        let value = message
            .resolveValue(scope)
            .unwrapOrElse(() => new NoneValue())
            .format(scope);
        return {value, errors: scope.errors};
    }
}
