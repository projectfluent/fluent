// Base class for all Fluent AST nodes.
export class BaseNode {
    constructor() {}
}

// Base class for AST nodes which can have Spans.
export class SyntaxNode extends BaseNode {
    addSpan(start, end) {
        this.span = new Span(start, end);
    }
}

export class Resource extends SyntaxNode {
    constructor(body = []) {
        super();
        this.type = "Resource";
        this.body = body;
    }
}

// An abstract base class for useful elements of Resource.body.
export class Entry extends SyntaxNode {}

export class Message extends Entry {
    constructor(id, value = null, attributes = [], comment = null) {
        super();
        this.type = "Message";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}

export class Term extends Entry {
    constructor(id, value, attributes = [], comment = null) {
        super();
        this.type = "Term";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}

export class Pattern extends SyntaxNode {
    constructor(elements) {
        super();
        this.type = "Pattern";
        this.elements = elements;
    }
}

// An abstract base class for elements of Patterns.
export class PatternElement extends SyntaxNode {}

export class TextElement extends PatternElement {
    constructor(value) {
        super();
        this.type = "TextElement";
        this.value = value;
    }
}

export class Placeable extends PatternElement {
    constructor(expression) {
        super();
        this.type = "Placeable";
        this.expression = expression;
    }
}

// An abstract base class for Expressions.
export class Expression extends SyntaxNode {}

// The "raw" field contains the exact contents of the string literal,
// character-for-character. Escape sequences are stored verbatim without
// processing. The "value" field contains the same contents with escape
// sequences unescaped to the characters they represent.
// See grammar.mjs for the definitions of well-formed escape sequences and
// abstract.mjs for the validation and unescaping logic.
export class StringLiteral extends Expression {
    constructor(raw, value) {
        super();
        this.type = "StringLiteral";
        this.raw = raw;
        this.value = value;
    }
}

export class NumberLiteral extends Expression {
    constructor(value) {
        super();
        this.type = "NumberLiteral";
        this.value = value;
    }
}

export class MessageReference extends Expression {
    constructor(id, attribute) {
        super();
        this.type = "MessageReference";
        this.id = id;
        this.attribute = attribute;
    }
}

export class TermReference extends Expression {
    constructor(id, attribute, args) {
        super();
        this.type = "TermReference";
        this.id = id;
        this.attribute = attribute;
        this.args = args;
    }
}

export class VariableReference extends Expression {
    constructor(id) {
        super();
        this.type = "VariableReference";
        this.id = id;
    }
}

export class FunctionReference extends Expression {
    constructor(id, args) {
        super();
        this.type = "FunctionReference";
        this.id = id;
        this.args = args;
    }
}

export class SelectExpression extends Expression {
    constructor(selector, variants) {
        super();
        this.type = "SelectExpression";
        this.selector = selector;
        this.variants = variants;
    }
}

export class Attribute extends SyntaxNode {
    constructor(id, value) {
        super();
        this.type = "Attribute";
        this.id = id;
        this.value = value;
    }
}

export class Variant extends SyntaxNode {
    constructor(key, value, def = false) {
        super();
        this.type = "Variant";
        this.key = key;
        this.value = value;
        this.default = def;
    }
}

export class CallArguments extends SyntaxNode {
    constructor(positional = [], named = []) {
        super();
        this.type = "CallArguments";
        this.positional = positional;
        this.named = named;
    }
}

export class NamedArgument extends SyntaxNode {
    constructor(name, value) {
        super();
        this.type = "NamedArgument";
        this.name = name;
        this.value = value;
    }
}

export class Identifier extends SyntaxNode {
    constructor(name) {
        super();
        this.type = "Identifier";
        this.name = name;
    }
}

export class BaseComment extends Entry {
    constructor(content) {
        super();
        this.type = "BaseComment";
        this.content = content;
    }
}

export class Comment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "Comment";
    }
}

export class GroupComment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "GroupComment";
    }
}
export class ResourceComment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "ResourceComment";
    }
}

export class Junk extends SyntaxNode {
    constructor(content) {
        super();
        this.type = "Junk";
        this.annotations = [];
        this.content = content;
    }

    addAnnotation(annot) {
        this.annotations.push(annot);
    }
}

export class Span extends BaseNode {
    constructor(start, end) {
        super();
        this.type = "Span";
        this.start = start;
        this.end = end;
    }
}

export class Annotation extends SyntaxNode {
    constructor(code, args = [], message) {
        super();
        this.type = "Annotation";
        this.code = code;
        this.args = args;
        this.message = message;
    }
}
