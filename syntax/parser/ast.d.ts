export declare class SyntaxNode {
    readonly type: string;
}

export declare class Identifier extends SyntaxNode {
    readonly type: "Identifer";
    readonly name: string;
}

export declare class StringLiteral extends SyntaxNode {
    readonly type: "StringLiteral";
    readonly value: string;
    parse(): {value: string};
}

export declare class MessageReference extends SyntaxNode {
    readonly type: "MessageReference";
    readonly id: Identifier;
    readonly attribute: Identifier | null;
}

export type InlineExpression = StringLiteral | MessageReference;

export type Expression = InlineExpression;

export declare class TextElement extends SyntaxNode {
    readonly type: "TextElement";
    readonly value: string;
}

export declare class Placeable extends SyntaxNode {
    readonly type: "Placeable";
    readonly expression: Expression;
}

export type PatternElement = TextElement | Placeable;

export declare class Pattern extends SyntaxNode {
    readonly type: "Pattern";
    readonly elements: Array<PatternElement>;
}

export declare class Message extends SyntaxNode {
    readonly type: "Message";
    readonly id: Identifier;
    readonly value: Pattern | null;
    readonly attributes: Array<Attribute>;
}

export declare class Attribute extends SyntaxNode {
    readonly type: "Attribute";
    readonly id: Identifier;
    readonly value: Pattern;
}

export type Entry = Message;

export declare class Resource extends SyntaxNode {
    readonly type: "Resource";
    readonly body: Array<Entry>;
}
