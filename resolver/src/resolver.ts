import * as ast from "./ast";
import {IResult, Success, Failure} from "./result";

export class Resolver {
    private readonly variables: Map<string, string>;
    public errors: Array<string>;

    constructor(variables: Map<string, string>) {
        this.variables = variables;
        this.errors = [];
    }

    resolve(node: ast.ISyntaxNode): IResult {
        switch (node.type) {
            case ast.SyntaxNode.Identifer:
                return this.resolveIdentifier(node as ast.IIdentifier);
            case ast.SyntaxNode.VariableReference:
                return this.resolveVariableReference(node as ast.IVariableReference);
            case ast.SyntaxNode.TextElement:
                return this.resolveTextElement(node as ast.ITextElement);
            case ast.SyntaxNode.Placeable:
                return this.resolvePlaceable(node as ast.IPlaceable);
            case ast.SyntaxNode.Pattern:
                return this.resolvePattern(node as ast.IPattern);
        }
    }

    resolveIdentifier(node: ast.IIdentifier): IResult {
        return new Success(node.name);
    }

    resolveVariableReference(node: ast.IVariableReference): IResult {
        return this.resolveIdentifier(node.id).then(id => {
            if (typeof id === "string") {
                let value = this.variables.get(id);
                if (value !== undefined) {
                    return new Success(value);
                } else {
                    this.errors.push("Missing variable");
                    return new Failure(`$${id}`);
                }
            } else {
                this.errors.push("Invalid id");
                return new Failure(id);
            }
        });
    }

    resolveTextElement(node: ast.ITextElement): IResult {
        return new Success(node.value);
    }

    resolvePlaceable(node: ast.IPlaceable): IResult {
        return this.resolve(node.expression);
    }

    resolvePattern(node: ast.IPattern): IResult {
        return new Success(
            node.elements
                .map(element => this.resolve(element).fold(value => value, value => `{${value}}`))
                .join("")
        );
    }
}
