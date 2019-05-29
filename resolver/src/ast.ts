export enum SyntaxNode {
    Identifer = "Identifier",
    VariableReference = "VariableReference",
    TextElement = "TextElement",
    Placeable = "Placeable",
    Pattern = "Pattern",
}

export interface ISyntaxNode {
    readonly type: SyntaxNode;
}

export interface IIdentifier extends ISyntaxNode {
    readonly type: SyntaxNode.Identifer;
    readonly name: string;
}

export interface IVariableReference extends ISyntaxNode {
    readonly type: SyntaxNode.VariableReference;
    readonly id: IIdentifier;
}

export interface ITextElement extends ISyntaxNode {
    readonly type: SyntaxNode.TextElement;
    readonly value: string;
}

export interface IPlaceable extends ISyntaxNode {
    readonly type: SyntaxNode.Placeable;
    readonly expression: IVariableReference;
}

export interface IPattern extends ISyntaxNode {
    readonly type: SyntaxNode.Pattern;
    readonly elements: Array<ITextElement | IPlaceable>;
}
