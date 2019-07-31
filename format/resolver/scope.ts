import * as ast from "../../syntax/parser/ast";
import {ErrorKind, ScopeError} from "./error";
import {Message} from "./message";
import {NoneValue, StringValue, Value} from "./value";

export class Scope {
    private readonly messages: Map<string, Message>;
    public errors: Array<ScopeError>;

    constructor(messages: Map<string, Message>, variables: Map<string, Value>) {
        this.messages = messages;
        this.errors = [];
    }

    resolveExpression(node: ast.Expression): Value {
        switch (node.type) {
            case "StringLiteral":
                return this.resolveStringLiteral(node);
            case "MessageReference":
                return this.resolveMessageReference(node);
            default:
                throw new TypeError("Unknown node type.");
        }
    }

    resolveStringLiteral(node: ast.StringLiteral): Value {
        let {value} = node.parse();
        return new StringValue(value);
    }

    resolveMessageReference(node: ast.MessageReference): Value {
        let message = this.messages.get(node.id.name);
        if (message == undefined) {
            this.errors.push(new ScopeError(ErrorKind.UnknownMessage, node.id.name));
            return new NoneValue(`${node.id.name}`);
        } else if (message.value) {
            return this.resolvePattern(message.value);
        } else {
            this.errors.push(new ScopeError(ErrorKind.MissingValue, node.id.name));
            return new NoneValue(`${node.id.name}`);
        }
    }

    resolvePatternElement(node: ast.PatternElement): Value {
        switch (node.type) {
            case "TextElement":
                return new StringValue(node.value);
            case "Placeable":
                return this.resolveExpression(node.expression);
            default:
                throw new TypeError("Unknown node type.");
        }
    }

    resolvePattern(node: ast.Pattern): Value {
        let parts = node.elements.map(element => this.resolvePatternElement(element).format(this));
        return new StringValue(parts.join(""));
    }
}
