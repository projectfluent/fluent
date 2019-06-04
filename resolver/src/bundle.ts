import * as ast from "./ast";
import {Scope} from "./scope";
import {Value, NoneValue} from "./value";
import {Message} from "./message";
import {ScopeError} from "./error";

export interface Formatted {
    readonly value: string | null;
    readonly errors: Array<ScopeError>;
}

export class Bundle {
    public readonly messages: Map<string, Message> = new Map();

    addResource(resource: Map<string, Message>) {
        for (let [id, message] of resource) {
            this.messages.set(id, message);
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
