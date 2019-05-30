export enum NodeType {
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

export interface SyntaxNode {
    readonly type: NodeType;
}

export interface Identifier extends SyntaxNode {
    readonly type: NodeType.Identifer;
    readonly name: string;
}

export interface VariableReference extends SyntaxNode {
    readonly type: NodeType.VariableReference;
    readonly id: Identifier;
}

export interface MessageReference extends SyntaxNode {
    readonly type: NodeType.MessageReference;
    readonly id: Identifier;
    readonly attribute: Identifier | null;
}

export interface SelectExpression extends SyntaxNode {
    readonly type: NodeType.SelectExpression;
    readonly selector: VariableReference;
    readonly variants: Array<Variant>;
}

export interface TextElement extends SyntaxNode {
    readonly type: NodeType.TextElement;
    readonly value: string;
}

export interface Placeable extends SyntaxNode {
    readonly type: NodeType.Placeable;
    readonly expression: VariableReference | MessageReference | SelectExpression;
}

export type PatternElement = TextElement | Placeable;

export interface Variant extends SyntaxNode {
    readonly type: NodeType.Variant;
    readonly key: Identifier;
    readonly value: Pattern;
    readonly default: boolean;
}

export interface Pattern extends SyntaxNode {
    readonly type: NodeType.Pattern;
    readonly elements: Array<PatternElement>;
}

export interface Message extends SyntaxNode {
    readonly type: NodeType.Message;
    readonly id: Identifier;
    readonly value: Pattern | null;
}
