import * as ast from "./ast";
import {Scope} from "./scope";
import {Failure, Result} from "./result";
import {Value, StringValue} from "./value";
import {ScopeError, ErrorKind} from "./error";

export class Message {
    private readonly id: string;
    private readonly value: ast.Pattern | null;

    constructor(node: ast.Message) {
        this.id = node.id.name;
        this.value = node.value;
    }

    resolveValue(scope: Scope): Result<Value> {
        if (this.value !== null) {
            return scope.resolvePattern(this.value);
        } else {
            scope.errors.push(new ScopeError(ErrorKind.MissingValue, this.id));
            return new Failure(new StringValue(this.id));
        }
    }
}
