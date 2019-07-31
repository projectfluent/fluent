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
            case ast.NodeType.VariableReference:
                return this.resolveVariableReference(node as ast.VariableReference);
            case ast.NodeType.MessageReference:
                return this.resolveMessageReference(node as ast.MessageReference);
            case ast.NodeType.SelectExpression:
                return this.resolveSelectExpression(node as ast.SelectExpression);
            default:
                throw new TypeError("Unknown node type.");
        }
    }

    resolveVariableReference(node: ast.VariableReference): Value {
        let value = this.variables.get(node.id.name);
        if (value !== undefined) {
            return value;
        } else {
            let name = `$${node.id.name}`;
            this.errors.push(new ScopeError(ErrorKind.UnknownVariable, name));
            return new NoneValue(name);
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

    resolveDefaultVariant(node: ast.SelectExpression): Value {
        for (let variant of node.variants) {
            if (variant.default) {
                return this.resolvePattern(variant.value);
            }
        }
        throw new RangeError("Missing default variant.");
    }

    resolveSelectExpression(node: ast.SelectExpression): Value {
        let selector = this.resolveExpression(node.selector);
        if (selector instanceof NoneValue) {
            return this.resolveDefaultVariant(node);
        }

        for (let variant of node.variants) {
            if (variant.key.name === selector.value) {
                return this.resolvePattern(variant.value);
            }
        }
        return this.resolveDefaultVariant(node);
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
