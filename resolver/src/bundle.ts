import * as ast from "./ast";
import {Scope} from "./scope";
import {Value, NoneValue} from "./value";
import {Message} from "./message";
import {hello, exclamation, select} from "./fixtures";

export interface Formatted {
    readonly value: string | null;
    readonly errors: Array<string>;
}

export class Bundle {
    messages = new Map(
        Object.entries({
            hello: new Message(hello as ast.Message),
            exclamation: new Message(exclamation as ast.Message),
            select: new Message(select as ast.Message),
        })
    );

    getMessage(id: string) {
        return this.messages.get(id);
    }

    private createScope(variables: Map<string, Value>) {
        return new Scope(this.messages, variables);
    }

    formatValue(message: Message, variables: Map<string, Value>): Formatted {
        let scope = this.createScope(variables);
        let result = message.resolveValue(scope);
        console.log(result);
        let value = result.fold(value => value, _ => new NoneValue()).format(scope);
        return {value, errors: scope.errors};
    }
}
