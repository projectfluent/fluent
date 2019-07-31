export enum NodeType {
    Identifer = "Identifier",
    StringLiteral = "StringLiteral",
    MessageReference = "MessageReference",
    TextElement = "TextElement",
    Placeable = "Placeable",
    Pattern = "Pattern",
    Message = "Message",
    Attribute = "Attribute",
    Resource = "Resource",
}

export interface SyntaxNode {
    readonly type: NodeType;
}

export interface Identifier extends SyntaxNode {
    readonly type: NodeType.Identifer;
    readonly name: string;
}

export interface StringLiteral extends SyntaxNode {
    readonly type: NodeType.StringLiteral;
    readonly value: string;
    parse(): {value: string};
}

export interface MessageReference extends SyntaxNode {
    readonly type: NodeType.MessageReference;
    readonly id: Identifier;
    readonly attribute: Identifier | null;
}

export type InlineExpression = StringLiteral | MessageReference;

export type Expression = InlineExpression;

export interface TextElement extends SyntaxNode {
    readonly type: NodeType.TextElement;
    readonly value: string;
}

export interface Placeable extends SyntaxNode {
    readonly type: NodeType.Placeable;
    readonly expression: Expression;
}

export type PatternElement = TextElement | Placeable;

export interface Pattern extends SyntaxNode {
    readonly type: NodeType.Pattern;
    readonly elements: Array<PatternElement>;
}

export interface Message extends SyntaxNode {
    readonly type: NodeType.Message;
    readonly id: Identifier;
    readonly value: Pattern | null;
    readonly attributes: Array<Attribute>;
}

export interface Attribute extends SyntaxNode {
    readonly type: NodeType.Attribute;
    readonly id: Identifier;
    readonly value: Pattern;
}

export type Entry = Message;

export interface Resource extends SyntaxNode {
    readonly type: NodeType.Resource;
    readonly body: Array<Entry>;
}
