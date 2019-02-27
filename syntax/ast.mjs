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

// An abstract base class for Literals.
export class Literal extends Expression {
    constructor(value) {
        super();
        // The "value" field contains the exact contents of the literal,
        // character-for-character.
        this.value = value;
    }

    // Implementations are free to decide how they process the raw value. When
    // they do, however, they must comply with the behavior of `Literal.parse`.
    parse() {
        return {value: this.value};
    }
}

export class StringLiteral extends Literal {
    constructor(value) {
        super(value);
        this.type = "StringLiteral";
    }

    parse() {
        // Backslash backslash, backslash double quote, uHHHH, UHHHHHH.
        const KNOWN_ESCAPES =
            /(?:\\\\|\\\"|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;

        function from_escape_sequence(match, codepoint4, codepoint6) {
            switch (match) {
                case "\\\\":
                    return "\\";
                case "\\\"":
                    return "\"";
                default:
                    let codepoint = parseInt(codepoint4 || codepoint6, 16);
                    if (codepoint <= 0xD7FF || 0xE000 <= codepoint) {
                        // It's a Unicode scalar value.
                        return String.fromCodePoint(codepoint);
                    }
                    // Escape sequences reresenting surrogate code points are
                    // well-formed but invalid in Fluent. Replace them with U+FFFD
                    // REPLACEMENT CHARACTER.
                    return "�";
            }
        }

        let value = this.value.replace(KNOWN_ESCAPES, from_escape_sequence);
        return {value};
    }
}

export class NumberLiteral extends Literal {
    constructor(value) {
        super(value);
        this.type = "NumberLiteral";
    }

    parse() {
        let value = parseFloat(this.value);
        let decimal_position = this.value.indexOf(".");
        let precision = decimal_position > 0
            ? this.value.length - decimal_position - 1
            : 0;
        return {value, precision};
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
        this.arguments = args;
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
        this.arguments = args;
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
        this.arguments = args;
        this.message = message;
    }
}
