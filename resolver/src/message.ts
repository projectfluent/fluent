import * as ast from "./ast";
import {Scope} from "./scope";
import {Failure, IResult} from "./result";
import {IValue, StringValue} from "./value";

export class Message {
    private readonly id: string;
    private readonly value: ast.IPattern | null;

    constructor(node: ast.IMessage) {
        this.id = node.id.name;
        this.value = node.value;
    }

    resolveValue(scope: Scope): IResult<IValue> {
        if (this.value !== null) {
            return scope.resolve(this.value);
        } else {
            scope.errors.push(`Message ${this.id} has a null value.`);
            return new Failure(new StringValue(this.id));
        }
    }
}
