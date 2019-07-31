import * as ast from "./ast";
import {ErrorKind, ScopeError} from "./error";
import {Message} from "./message";
import {NoneValue, StringValue, Value} from "./value";

export class Scope {
    private readonly messages: Map<string, Message>;
    private readonly variables: Map<string, Value>;
    public errors: Array<ScopeError>;

    constructor(messages: Map<string, Message>, variables: Map<string, Value>) {
        this.messages = messages;
        this.variables = variables;
        this.errors = [];
    }

    resolveExpression(node: ast.Expression): Value {
        switch (node.type) {
            case ast.NodeType.MessageReference:
                return this.resolveMessageReference(node as ast.MessageReference);
            default:
                throw new TypeError("Unknown node type.");
        }
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
            case ast.NodeType.TextElement:
                return new StringValue(node.value);
            case ast.NodeType.Placeable:
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
