/*
 * Base class for all Fluent AST nodes.
 */
export class BaseNode {
    constructor() {}
}

/*
 * Base class for AST nodes which can have Spans.
 */
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

export class Entry extends SyntaxNode {
    constructor() {
        super();
        this.type = "Entry";
        this.annotations = [];
    }

    addAnnotation(annot) {
        this.annotations.push(annot);
    }
}

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

export class TextElement extends SyntaxNode {
    constructor(value) {
        super();
        this.type = "TextElement";
        this.value = value;
    }
}

export class Placeable extends SyntaxNode {
    constructor(expression) {
        super();
        this.type = "Placeable";
        this.expression = expression;
    }
}

export class Expression extends SyntaxNode {
    constructor() {
        super();
        this.type = "Expression";
    }
}

export class StringExpression extends Expression {
    constructor(value) {
        super();
        this.type = "StringExpression";
        this.value = value;
    }
}

export class NumberExpression extends Expression {
    constructor(value) {
        super();
        this.type = "NumberExpression";
        this.value = value;
    }
}

export class MessageReference extends Expression {
    constructor(id) {
        super();
        this.type = "MessageReference";
        this.id = id;
    }
}

export class TermReference extends Expression {
    constructor(id) {
        super();
        this.type = "TermReference";
        this.id = id;
    }
}

export class ExternalArgument extends Expression {
    constructor(id) {
        super();
        this.type = "ExternalArgument";
        this.id = id;
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

export class AttributeExpression extends Expression {
    constructor(ref, name) {
        super();
        this.type = "AttributeExpression";
        this.ref = ref;
        this.name = name;
    }
}

export class VariantExpression extends Expression {
    constructor(ref, key) {
        super();
        this.type = "VariantExpression";
        this.ref = ref;
        this.key = key;
    }
}

export class CallExpression extends Expression {
    constructor(callee, positional = [], named = []) {
        super();
        this.type = "CallExpression";
        this.callee = callee;
        this.positional = positional;
        this.named = named;
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

export class VariantName extends Identifier {
    constructor(name) {
        super(name);
        this.type = "VariantName";
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

export class Function extends Identifier {
    constructor(name) {
        super(name);
        this.type = "Function";
    }
}

export class Junk extends Entry {
    constructor(content) {
        super();
        this.type = "Junk";
        this.content = content;
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
