/* eslint-disable */

"use strict";

Object.defineProperty(exports, "__esModule", {value: true});

// Base class for all Fluent AST nodes.
class BaseNode {
    constructor() {}
}

// Base class for AST nodes which can have Spans.
class SyntaxNode extends BaseNode {
    addSpan(start, end) {
        this.span = new Span(start, end);
    }
}

class Resource extends SyntaxNode {
    constructor(body = []) {
        super();
        this.type = "Resource";
        this.body = body;
    }
}

// An abstract base class for useful elements of Resource.body.
class Entry extends SyntaxNode {}

class Message extends Entry {
    constructor(id, value = null, attributes = [], comment = null) {
        super();
        this.type = "Message";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}

class Term extends Entry {
    constructor(id, value, attributes = [], comment = null) {
        super();
        this.type = "Term";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}

class Pattern extends SyntaxNode {
    constructor(elements) {
        super();
        this.type = "Pattern";
        this.elements = elements;
    }
}

// An abstract base class for elements of Patterns.
class PatternElement extends SyntaxNode {}

class TextElement extends PatternElement {
    constructor(value) {
        super();
        this.type = "TextElement";
        this.value = value;
    }
}

class Placeable extends PatternElement {
    constructor(expression) {
        super();
        this.type = "Placeable";
        this.expression = expression;
    }
}

// An abstract base class for Expressions.
class Expression extends SyntaxNode {}

// An abstract base class for Literals.
class Literal extends Expression {
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

class StringLiteral extends Literal {
    constructor(value) {
        super(value);
        this.type = "StringLiteral";
    }

    parse() {
        // Backslash backslash, backslash double quote, uHHHH, UHHHHHH.
        const KNOWN_ESCAPES = /(?:\\\\|\\\"|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;

        function from_escape_sequence(match, codepoint4, codepoint6) {
            switch (match) {
                case "\\\\":
                    return "\\";
                case '\\"':
                    return '"';
                default:
                    let codepoint = parseInt(codepoint4 || codepoint6, 16);
                    if (codepoint <= 0xd7ff || 0xe000 <= codepoint) {
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

class NumberLiteral extends Literal {
    constructor(value) {
        super(value);
        this.type = "NumberLiteral";
    }

    parse() {
        let value = parseFloat(this.value);
        let decimal_position = this.value.indexOf(".");
        let precision = decimal_position > 0 ? this.value.length - decimal_position - 1 : 0;
        return {value, precision};
    }
}

class MessageReference extends Expression {
    constructor(id, attribute) {
        super();
        this.type = "MessageReference";
        this.id = id;
        this.attribute = attribute;
    }
}

class TermReference extends Expression {
    constructor(id, attribute, args) {
        super();
        this.type = "TermReference";
        this.id = id;
        this.attribute = attribute;
        this.arguments = args;
    }
}

class VariableReference extends Expression {
    constructor(id) {
        super();
        this.type = "VariableReference";
        this.id = id;
    }
}

class FunctionReference extends Expression {
    constructor(id, args) {
        super();
        this.type = "FunctionReference";
        this.id = id;
        this.arguments = args;
    }
}

class SelectExpression extends Expression {
    constructor(selector, variants) {
        super();
        this.type = "SelectExpression";
        this.selector = selector;
        this.variants = variants;
    }
}

class Attribute extends SyntaxNode {
    constructor(id, value) {
        super();
        this.type = "Attribute";
        this.id = id;
        this.value = value;
    }
}

class Variant extends SyntaxNode {
    constructor(key, value, def = false) {
        super();
        this.type = "Variant";
        this.key = key;
        this.value = value;
        this.default = def;
    }
}

class CallArguments extends SyntaxNode {
    constructor(positional = [], named = []) {
        super();
        this.type = "CallArguments";
        this.positional = positional;
        this.named = named;
    }
}

class NamedArgument extends SyntaxNode {
    constructor(name, value) {
        super();
        this.type = "NamedArgument";
        this.name = name;
        this.value = value;
    }
}

class Identifier extends SyntaxNode {
    constructor(name) {
        super();
        this.type = "Identifier";
        this.name = name;
    }
}

class BaseComment extends Entry {
    constructor(content) {
        super();
        this.type = "BaseComment";
        this.content = content;
    }
}

class Comment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "Comment";
    }
}

class GroupComment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "GroupComment";
    }
}
class ResourceComment extends BaseComment {
    constructor(content) {
        super(content);
        this.type = "ResourceComment";
    }
}

class Junk extends SyntaxNode {
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

class Span extends BaseNode {
    constructor(start, end) {
        super();
        this.type = "Span";
        this.start = start;
        this.end = end;
    }
}

class Stream {
    constructor(iterable, cursor, length) {
        this.iterable = iterable;
        this.cursor = cursor || 0;
        this.length = length === undefined ? iterable.length - this.cursor : length;
    }

    // Get the element at the cursor.
    head(len = 1) {
        if (this.length < 0) {
            return undefined;
        }

        if (this.length === 0) {
            return Symbol.for("eof");
        }

        return this.iterable.slice(this.cursor, this.cursor + len);
    }

    // Execute a regex on the iterable.
    exec(re) {
        // The "u" flag is a feature of ES2015 which makes regexes Unicode-aware.
        // See https://mathiasbynens.be/notes/es6-unicode-regex.
        // The "y" flag makes the regex sticky. The match must start at the
        // offset specified by the regex's lastIndex property.
        let sticky = new RegExp(re, "uy");
        sticky.lastIndex = this.cursor;
        return sticky.exec(this.iterable);
    }

    // Consume the stream by moving the cursor.
    move(distance) {
        return new Stream(this.iterable, this.cursor + distance, this.length - distance);
    }
}

class Result {
    constructor(value, rest) {
        this.value = value;
        this.rest = rest;
    }
}

class Success extends Result {
    map(fn) {
        return new Success(fn(this.value), this.rest);
    }
    bimap(s, f) {
        return new Success(s(this.value), this.rest);
    }
    chain(fn) {
        return fn(this.value, this.rest);
    }
    fold(s, f) {
        return s(this.value, this.rest);
    }
}

class Failure extends Result {
    map(fn) {
        return this;
    }
    bimap(s, f) {
        return new Failure(f(this.value), this.rest);
    }
    chain(fn) {
        return this;
    }
    fold(s, f) {
        return f(this.value, this.rest);
    }
}

class Abstract {
    constructor(value) {
        this.value = value;
    }
}

class Parser {
    constructor(parse) {
        this.parse = parse;
    }

    run(iterable) {
        let stream = iterable instanceof Stream ? iterable : new Stream(iterable);
        return this.parse(stream);
    }

    get abstract() {
        return this.map(value => new Abstract(value));
    }

    map(f) {
        return new Parser(stream => this.run(stream).map(f));
    }

    bimap(s, f) {
        return new Parser(stream => this.run(stream).bimap(s, f));
    }

    chain(f) {
        return new Parser(stream => this.run(stream).chain((value, tail) => f(value).run(tail)));
    }

    fold(s, f) {
        return new Parser(stream => this.run(stream).fold(s, f));
    }
}

// Flatten a list up to a given depth.
// This is useful when a parser uses nested sequences and repeats.
const flatten = depth => list =>
    list.reduce(
        (acc, cur) =>
            acc.concat(!Array.isArray(cur) || depth === 1 ? cur : flatten(depth - 1)(cur)),
        []
    );

// Mutate an object by merging properties of another object into it.
const mutate = state => obj => Object.assign(obj, state);

// Join the list of parsed values into a string.
const join = list => list.filter(value => value !== Symbol.for("eof")).join("");

// Prune unmatched maybes from a list.
const prune = list => list.filter(value => value !== null);

// Map a list of {name, value} aliases into an array of values.
const keep_abstract = list =>
    list.filter(value => value instanceof Abstract).map(({value}) => value);

// Map a list to the element at the specified index. Useful for parsers which
// define a prefix or a surrounding delimiter.
const element_at = index => list => list[index];

function defer(fn) {
    // Parsers may be defined as defer(() => parser) to avoid cyclic
    // dependecies.
    return new Parser(stream => fn().run(stream));
}

function string(str) {
    return new Parser(stream =>
        stream.head(str.length) === str
            ? new Success(str, stream.move(str.length))
            : new Failure(`${str} not found`, stream)
    );
}

function regex(re) {
    return new Parser(stream => {
        const result = stream.exec(re);

        if (result === null) {
            return new Failure("regex did not match", stream);
        }

        const [match] = result;

        return new Success(match, stream.move(match.length));
    });
}

function charset(range) {
    return regex(`[${range}]`);
}

function eof() {
    return new Parser(stream =>
        stream.head() === Symbol.for("eof")
            ? new Success(stream.head(), stream.move(1))
            : new Failure("not at EOF", stream)
    );
}

function lookahead(parser) {
    return new Parser(stream =>
        parser
            .run(stream)
            .fold(value => new Success(value, stream), value => new Failure(value, stream))
    );
}

function not(parser) {
    return new Parser(stream =>
        parser
            .run(stream)
            .fold(
                (value, tail) => new Failure("not failed", stream),
                (value, tail) => new Success(null, stream)
            )
    );
}

function and(...parsers) {
    const final = parsers.pop();
    return sequence(...parsers.map(lookahead), final).map(results => results[results.length - 1]);
}

function either(...parsers) {
    return new Parser(stream => {
        for (const parser of parsers) {
            const result = parser.run(stream);
            if (result instanceof Success) {
                return result;
            }
        }
        return new Failure("either failed", stream);
    });
}

function always(value) {
    return new Parser(stream => new Success(value, stream));
}

function never(value) {
    return new Parser(stream => new Failure(value, stream));
}

function maybe(parser) {
    return new Parser(stream =>
        parser
            .run(stream)
            .fold(
                (value, tail) => new Success(value, tail),
                (value, tail) => new Success(null, stream)
            )
    );
}

function append(p1, p2) {
    return p1.chain(values => p2.map(value => values.concat([value])));
}

function sequence(...parsers) {
    return parsers.reduce((acc, parser) => append(acc, parser), always([]));
}

function repeat(parser) {
    return new Parser(stream =>
        parser.run(stream).fold(
            (value, tail) =>
                repeat(parser)
                    .map(rest => [value].concat(rest))
                    .run(tail),
            (value, tail) => new Success([], stream)
        )
    );
}

function repeat1(parser) {
    return new Parser(stream =>
        parser.run(stream).fold(
            (value, tail) =>
                repeat(parser)
                    .map(rest => [value].concat(rest))
                    .run(tail),
            (value, tail) => new Failure("repeat1 failed", stream)
        )
    );
}

/*
 * AST Validation
 *
 * The parse result of the grammar.mjs parser is a well-formed AST which is
 * validated according to the rules documented in `spec/valid.md`.
 */

function list_into(Type) {
    switch (Type) {
        case Comment:
            return ([sigil, content = ""]) => {
                switch (sigil) {
                    case "#":
                        return always(new Comment(content));
                    case "##":
                        return always(new GroupComment(content));
                    case "###":
                        return always(new ResourceComment(content));
                    default:
                        return never(`Unknown comment sigil: ${sigil}.`);
                }
            };
        case FunctionReference:
            const VALID_FUNCTION_NAME = /^[A-Z][A-Z0-9_-]*$/;
            return ([identifier, args]) => {
                if (VALID_FUNCTION_NAME.test(identifier.name)) {
                    return always(new Type(identifier, args));
                }
                return never(
                    `Invalid function name: ${identifier.name}. ` +
                        "Function names must be all upper-case ASCII letters."
                );
            };
        case Pattern:
            return elements =>
                always(
                    new Pattern(
                        dedent(elements)
                            .reduce(join_adjacent(TextElement), [])
                            .map(trim_text_at_extremes)
                            .filter(remove_empty_text)
                    )
                );
        case Resource:
            return entries =>
                always(
                    new Resource(
                        entries
                            .reduce(join_adjacent(Comment, GroupComment, ResourceComment), [])
                            .reduce(attach_comments, [])
                            .filter(remove_blank_lines)
                    )
                );
        case SelectExpression:
            return ([selector, variants]) => {
                let selector_is_valid =
                    selector instanceof StringLiteral ||
                    selector instanceof NumberLiteral ||
                    selector instanceof VariableReference ||
                    selector instanceof FunctionReference ||
                    (selector instanceof TermReference && selector.attribute);
                if (!selector_is_valid) {
                    return never(`Invalid selector type: ${selector.type}.`);
                }

                return always(new Type(selector, variants));
            };
        default:
            return elements => always(new Type(...elements));
    }
}

function into(Type) {
    switch (Type) {
        case CallArguments:
            return args => {
                let positional = [];
                let named = new Map();
                for (let arg of args) {
                    if (arg instanceof NamedArgument) {
                        let name = arg.name.name;
                        if (named.has(name)) {
                            return never("Named arguments must be unique.");
                        }
                        named.set(name, arg);
                    } else if (named.size > 0) {
                        return never("Positional arguments must not follow " + "named arguments");
                    } else {
                        positional.push(arg);
                    }
                }
                return always(new Type(positional, Array.from(named.values())));
            };
        case Placeable:
            return expression => {
                if (expression instanceof TermReference && expression.attribute) {
                    return never("Term attributes may not be used as placeables.");
                }
                return always(new Type(expression));
            };
        default:
            return (...args) => always(new Type(...args));
    }
}

// Create a reducer suitable for joining adjacent nodes of the same type, if
// type is one of types specified.
function join_adjacent(...types) {
    return function(acc, cur) {
        let prev = acc[acc.length - 1];
        for (let Type of types) {
            if (prev instanceof Type && cur instanceof Type) {
                // Replace prev with a new node of the same type whose value is
                // the sum of prev and cur, and discard cur.
                acc[acc.length - 1] = join_of_type(Type, prev, cur);
                return acc;
            }
        }
        return acc.concat(cur);
    };
}

// Join values of two or more nodes of the same type. Return a new node.
function join_of_type(Type, ...elements) {
    // TODO Join annotations and spans.
    switch (Type) {
        case TextElement:
            return elements.reduce((a, b) => new Type(a.value + b.value));
        case Comment:
        case GroupComment:
        case ResourceComment:
            return elements.reduce((a, b) => new Type(a.content + "\n" + b.content));
    }
}

function attach_comments(acc, cur) {
    let prev = acc[acc.length - 1];
    if (prev instanceof Comment && (cur instanceof Message || cur instanceof Term)) {
        cur.comment = prev;
        acc[acc.length - 1] = cur;
        return acc;
    } else {
        return acc.concat(cur);
    }
}

// Remove the largest common indentation from a list of elements of a Pattern.
// The indents are parsed in grammar.mjs and passed to abstract.mjs as string
// primitives along with other PatternElements.
function dedent(elements) {
    // Calculate the maximum common indent.
    let indents = elements.filter(element => typeof element === "string");
    let common = Math.min(...indents.map(indent => indent.length));

    function trim_indents(element) {
        if (typeof element === "string") {
            // Trim the indent and convert it to a proper TextElement.
            // It will be joined with its adjacents later on.
            return new TextElement(element.slice(common));
        }
        return element;
    }

    return elements.map(trim_indents);
}

const LEADING_BLANK_BLOCK = /^\n*/;
const TRAILING_BLANK_INLINE = / *$/;

function trim_text_at_extremes(element, index, array) {
    if (element instanceof TextElement) {
        if (index === 0) {
            element.value = element.value.replace(LEADING_BLANK_BLOCK, "");
        }
        if (index === array.length - 1) {
            element.value = element.value.replace(TRAILING_BLANK_INLINE, "");
        }
    }
    return element;
}

function remove_empty_text(element) {
    return !(element instanceof TextElement) || element.value !== "";
}

function remove_blank_lines(element) {
    return typeof element !== "string";
}

/* ----------------------------------------------------- */
/* An FTL file defines a Resource consisting of Entries. */
let Resource$1 = defer(() =>
    repeat(either(Entry$1, blank_block, Junk$1)).chain(list_into(Resource))
);

/* ------------------------------------------------------------------------- */
/* Entries are the main building blocks of Fluent. They define translations and
 * contextual and semantic information about the translations. During the AST
 * construction, adjacent comment lines of the same comment type (defined by
 * the number of #) are joined together. Single-# comments directly preceding
 * Messages and Terms are attached to the Message or Term and are not
 * standalone Entries. */
let Entry$1 = defer(() =>
    either(
        sequence(Message$1, line_end).map(element_at(0)),
        sequence(Term$1, line_end).map(element_at(0)),
        CommentLine
    )
);

let Message$1 = defer(() =>
    sequence(
        Identifier$1.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        either(
            sequence(Pattern$1.abstract, repeat(Attribute$1).abstract),
            sequence(always(null).abstract, repeat1(Attribute$1).abstract)
        )
    )
        .map(flatten(1))
        .map(keep_abstract)
        .chain(list_into(Message))
);

let Term$1 = defer(() =>
    sequence(
        string("-"),
        Identifier$1.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        Pattern$1.abstract,
        repeat(Attribute$1).abstract
    )
        .map(keep_abstract)
        .chain(list_into(Term))
);

/* -------------------------------------------------------------------------- */
/* Adjacent comment lines of the same comment type are joined together during
 * the AST construction. */
let CommentLine = defer(() =>
    sequence(
        either(string("###"), string("##"), string("#")).abstract,
        maybe(sequence(string(" "), repeat(comment_char).map(join).abstract)),
        line_end
    )
        .map(flatten(1))
        .map(keep_abstract)
        .chain(list_into(Comment))
);

let comment_char = defer(() => and(not(line_end), any_char));

/* -------------------------------------------------------------------------- */
/* Junk represents unparsed content.
 *
 * Junk is parsed line-by-line until a line is found which looks like it might
 * be a beginning of a new message, term, or a comment. Any whitespace
 * following a broken Entry is also considered part of Junk.
 */
let Junk$1 = defer(() =>
    sequence(
        junk_line,
        repeat(and(not(charset("a-zA-Z")), not(string("-")), not(string("#")), junk_line))
    )
        .map(flatten(1))
        .map(join)
        .chain(into(Junk))
);

let junk_line = sequence(regex(/[^\n]*/), either(string("\u000A"), eof())).map(join);

/* --------------------------------- */
/* Attributes of Messages and Terms. */
let Attribute$1 = defer(() =>
    sequence(
        line_end,
        maybe(blank),
        string("."),
        Identifier$1.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        Pattern$1.abstract
    )
        .map(keep_abstract)
        .chain(list_into(Attribute))
);

/* ---------------------------------------------------------------- */
/* Patterns are values of Messages, Terms, Attributes and Variants. */
let Pattern$1 = defer(() =>
    repeat1(PatternElement$1)
        // Flatten block_text and block_placeable which return lists.
        .map(flatten(1))
        .chain(list_into(Pattern))
);

/* ----------------------------------------------------------------- */
/* TextElement and Placeable can occur inline or as block.
 * Text needs to be indented and start with a non-special character.
 * Placeables can start at the beginning of the line or be indented.
 * Adjacent TextElements are joined in AST creation. */

let PatternElement$1 = defer(() =>
    either(inline_text, block_text, inline_placeable, block_placeable)
);

let inline_text = defer(() =>
    repeat1(text_char)
        .map(join)
        .chain(into(TextElement))
);

let block_text = defer(() =>
    sequence(
        blank_block.chain(into(TextElement)),
        blank_inline,
        indented_char.chain(into(TextElement)),
        maybe(inline_text)
    ).map(prune)
);

let inline_placeable = defer(() =>
    sequence(
        string("{"),
        maybe(blank),
        either(
            // Order matters!
            SelectExpression$1,
            InlineExpression
        ),
        maybe(blank),
        string("}")
    )
        .map(element_at(2))
        .chain(into(Placeable))
);

let block_placeable = defer(() =>
    sequence(
        blank_block.chain(into(TextElement)),
        // No indent before a placeable counts as 0 in dedention logic.
        maybe(blank_inline).map(s => s || ""),
        inline_placeable
    )
);

/* ------------------------------------------------------------------- */
/* Rules for validating expressions in Placeables and as selectors of
 * SelectExpressions are documented in spec/valid.md and enforced in
 * syntax/abstract.mjs. */
let InlineExpression = defer(() =>
    either(
        StringLiteral$1,
        NumberLiteral$1,
        FunctionReference$1,
        MessageReference$1,
        TermReference$1,
        VariableReference$1,
        inline_placeable
    )
);

/* -------- */
/* Literals */
let StringLiteral$1 = defer(() =>
    sequence(string('"'), repeat(quoted_char), string('"'))
        .map(element_at(1))
        .map(join)
        .chain(into(StringLiteral))
);

let NumberLiteral$1 = defer(() =>
    sequence(maybe(string("-")), digits, maybe(sequence(string("."), digits)))
        .map(flatten(1))
        .map(join)
        .chain(into(NumberLiteral))
);

/* ------------------ */
/* Inline Expressions */
let FunctionReference$1 = defer(() =>
    sequence(Identifier$1, CallArguments$1).chain(list_into(FunctionReference))
);

let MessageReference$1 = defer(() =>
    sequence(Identifier$1, maybe(AttributeAccessor)).chain(list_into(MessageReference))
);

let TermReference$1 = defer(() =>
    sequence(
        string("-"),
        Identifier$1.abstract,
        maybe(AttributeAccessor).abstract,
        maybe(CallArguments$1).abstract
    )
        .map(keep_abstract)
        .chain(list_into(TermReference))
);

let VariableReference$1 = defer(() =>
    sequence(string("$"), Identifier$1)
        .map(element_at(1))
        .chain(into(VariableReference))
);

let AttributeAccessor = defer(() => sequence(string("."), Identifier$1)).map(element_at(1));

let CallArguments$1 = defer(() =>
    sequence(maybe(blank), string("("), maybe(blank), argument_list, maybe(blank), string(")"))
        .map(element_at(3))
        .chain(into(CallArguments))
);

let argument_list = defer(() =>
    sequence(
        repeat(sequence(Argument.abstract, maybe(blank), string(","), maybe(blank))),
        maybe(Argument.abstract)
    )
        .map(flatten(2))
        .map(keep_abstract)
);

let Argument = defer(() => either(NamedArgument$1, InlineExpression));

let NamedArgument$1 = defer(() =>
    sequence(
        Identifier$1.abstract,
        maybe(blank),
        string(":"),
        maybe(blank),
        either(StringLiteral$1, NumberLiteral$1).abstract
    )
        .map(keep_abstract)
        .chain(list_into(NamedArgument))
);

/* ----------------- */
/* Block Expressions */
let SelectExpression$1 = defer(() =>
    sequence(
        InlineExpression.abstract,
        maybe(blank),
        string("->"),
        maybe(blank_inline),
        variant_list.abstract
    )
        .map(keep_abstract)
        .chain(list_into(SelectExpression))
);

let variant_list = defer(() =>
    sequence(
        repeat(Variant$1).abstract,
        DefaultVariant.abstract,
        repeat(Variant$1).abstract,
        line_end
    )
        .map(keep_abstract)
        .map(flatten(1))
);

let Variant$1 = defer(() =>
    sequence(line_end, maybe(blank), VariantKey.abstract, maybe(blank_inline), Pattern$1.abstract)
        .map(keep_abstract)
        .chain(list_into(Variant))
);

let DefaultVariant = defer(() =>
    sequence(
        line_end,
        maybe(blank),
        string("*"),
        VariantKey.abstract,
        maybe(blank_inline),
        Pattern$1.abstract
    )
        .map(keep_abstract)
        .chain(list_into(Variant))
        .map(mutate({default: true}))
);

let VariantKey = defer(() =>
    sequence(
        string("["),
        maybe(blank),
        either(NumberLiteral$1, Identifier$1),
        maybe(blank),
        string("]")
    ).map(element_at(2))
);

/* ---------- */
/* Identifier */

let Identifier$1 = sequence(charset("a-zA-Z"), repeat(charset("a-zA-Z0-9_-")))
    .map(flatten(1))
    .map(join)
    .chain(into(Identifier));

/* -------------------------------------------------------------------------- */
/* Content Characters
 *
 * Translation content can be written using any Unicode characters. However,
 * some characters are considered special depending on the type of content
 * they're in. See text_char and quoted_char for more information.
 *
 * Some Unicode characters, even if allowed, should be avoided in Fluent
 * resources. See spec/recommendations.md.
 */

let any_char = charset("\\u{0}-\\u{10FFFF}");

/* -------------------------------------------------------------------------- */
/* Text elements
 *
 * The primary storage for content are text elements. Text elements are not
 * delimited with quotes and may span multiple lines as long as all lines are
 * indented. The opening brace ({) marks a start of a placeable in the pattern
 * and may not be used in text elements verbatim. Due to the indentation
 * requirement some text characters may not appear as the first character on a
 * new line.
 */

let special_text_char = either(string("{"), string("}"));

let text_char = defer(() => and(not(line_end), not(special_text_char), any_char));

let indented_char = and(not(string(".")), not(string("*")), not(string("[")), text_char);

/* -------------------------------------------------------------------------- */
/* String literals
 *
 * For special-purpose content, quoted string literals can be used where text
 * elements are not a good fit. String literals are delimited with double
 * quotes and may not contain line breaks. String literals use the backslash
 * (\) as the escape character. The literal double quote can be inserted via
 * the \" escape sequence. The literal backslash can be inserted with \\. The
 * literal opening brace ({) is allowed in string literals because they may not
 * comprise placeables.
 */

let special_quoted_char = either(string('"'), string("\\"));

let special_escape = sequence(string("\\"), special_quoted_char).map(join);

let unicode_escape = either(
    sequence(string("\\u"), regex(/[0-9a-fA-F]{4}/)),
    sequence(string("\\U"), regex(/[0-9a-fA-F]{6}/))
).map(join);

let quoted_char = defer(() =>
    either(and(not(line_end), not(special_quoted_char), any_char), special_escape, unicode_escape)
);

/* ------- */
/* Numbers */

let digits = repeat1(charset("0-9")).map(join);

/* ---------- */
/* Whitespace */
let blank_inline = repeat1(string("\u0020")).map(join);

let line_end = either(
    // Normalize CRLF to LF.
    string("\u000D\u000A").map(() => "\n"),
    string("\u000A"),
    eof()
);

let blank_block = repeat1(sequence(maybe(blank_inline), line_end.abstract))
    .map(flatten(1))
    // Discard the indents and only keep the newlines
    // for multiline Patterns.
    .map(keep_abstract)
    .map(join);

let blank = repeat1(either(blank_inline, line_end));

exports.Entry = Entry$1;
exports.NumberLiteral = NumberLiteral$1;
exports.Resource = Resource$1;
exports.StringLiteral = StringLiteral$1;
