export enum SyntaxNode {
    Identifer = "Identifier",
    VariableReference = "VariableReference",
    MessageReference = "MessageReference",
    SelectExpression = "SelectExpression",
    TextElement = "TextElement",
    Placeable = "Placeable",
    Variant = "Variant",
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

export interface ISelectExpression extends ISyntaxNode {
    readonly type: SyntaxNode.SelectExpression;
    readonly selector: IVariableReference;
    readonly variants: Array<IVariant>;
}

export interface ITextElement extends ISyntaxNode {
    readonly type: SyntaxNode.TextElement;
    readonly value: string;
}

export interface IPlaceable extends ISyntaxNode {
    readonly type: SyntaxNode.Placeable;
    readonly expression: IVariableReference | IMessageReference | ISelectExpression;
}

export interface IVariant extends ISyntaxNode {
    readonly type: SyntaxNode.Variant;
    readonly key: IIdentifier;
    readonly value: IPattern;
    readonly default: boolean;
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
