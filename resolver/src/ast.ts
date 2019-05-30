export enum SyntaxNode {
    Identifer = "Identifier",
    VariableReference = "VariableReference",
    MessageReference = "MessageReference",
    TextElement = "TextElement",
    Placeable = "Placeable",
    Pattern = "Pattern",
    Message = "Message",
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

export interface IMessageReference extends ISyntaxNode {
    readonly type: SyntaxNode.MessageReference;
    readonly id: IIdentifier;
    readonly attribute: IIdentifier | null;
}

export interface ITextElement extends ISyntaxNode {
    readonly type: SyntaxNode.TextElement;
    readonly value: string;
}

export interface IPlaceable extends ISyntaxNode {
    readonly type: SyntaxNode.Placeable;
    readonly expression: IVariableReference | IMessageReference;
}

export interface IPattern extends ISyntaxNode {
    readonly type: SyntaxNode.Pattern;
    readonly elements: Array<ITextElement | IPlaceable>;
}

export interface IMessage extends ISyntaxNode {
    readonly type: SyntaxNode.Message;
    readonly id: IIdentifier;
    readonly value: IPattern | null;
}
