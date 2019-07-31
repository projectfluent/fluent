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
    Attribute = "Attribute",
    GroupComment = "GroupComment",
    Resource = "Resource",
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
    readonly selector: InlineExpression;
    readonly variants: Array<Variant>;
}

export type InlineExpression = VariableReference | MessageReference;

export type Expression = InlineExpression | SelectExpression;

export interface TextElement extends SyntaxNode {
    readonly type: NodeType.TextElement;
    readonly value: string;
}

export interface Placeable extends SyntaxNode {
    readonly type: NodeType.Placeable;
    readonly expression: Expression;
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
    readonly attributes: Array<Attribute>;
}

export interface Attribute extends SyntaxNode {
    readonly type: NodeType.Attribute;
    readonly id: Identifier;
    readonly value: Pattern;
}

export interface GroupComment extends SyntaxNode {
    readonly type: NodeType.GroupComment;
    readonly content: string;
}

export type Entry = Message | GroupComment;

export interface Resource extends SyntaxNode {
    readonly type: NodeType.Resource;
    readonly body: Array<Entry>;
}
