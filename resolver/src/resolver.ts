import * as ast from "./ast";

export class Resolver {
    private readonly variables: Map<string, string>;

    constructor(variables: Map<string, string>) {
        this.variables = variables;
    }

    resolve(node: ast.ISyntaxNode): string {
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

    resolveIdentifier(node: ast.IIdentifier): string {
        return node.name;
    }

    resolveVariableReference(node: ast.IVariableReference): string {
        let id = this.resolveIdentifier(node.id);
        let value = this.variables.get(id);
        if (value !== undefined) {
            return value;
        } else {
            return id;
        }
   }

    resolveTextElement(node: ast.ITextElement): string {
        return node.value;
    }

    resolvePlaceable(node: ast.IPlaceable): string {
        return this.resolve(node.expression);
    }

    resolvePattern(node: ast.IPattern): string {
        return node.elements.map(element => this.resolve(element)).join("");
    }
}
