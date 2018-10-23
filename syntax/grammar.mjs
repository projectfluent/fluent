import * as FTL from "./ast.mjs";
import {list_into, into} from "./abstract.mjs";
import {
    always, and, charset, defer, either, eof, maybe, not,
    regex, repeat, repeat1, sequence, string
} from "../lib/combinators.mjs";
import {
    element_at, flatten, join, keep_abstract, mutate, print
} from "../lib/mappers.mjs";

/* ----------------------------------------------------- */
/* An FTL file defines a Resource consisting of Entries. */
export
let Resource = defer(() =>
    repeat(
        either(
            Entry,
            blank_block,
            junk_line))
    .chain(list_into(FTL.Resource)));

/* ------------------------------------------------------------------------- */
/* Entries are the main building blocks of Fluent. They define translations and
 * contextual and semantic information about the translations. During the AST
 * construction, adjacent comment lines of the same comment type (defined by
 * the number of #) are joined together. Single-# comments directly preceding
 * Messages and Terms are attached to the Message or Term and are not
 * standalone Entries. */
export
let Entry = defer(() =>
    either(
        sequence(
            Message,
            line_end).map(element_at(0)),
        sequence(
            Term,
            line_end).map(element_at(0)),
        CommentLine));

let Message = defer(() =>
    sequence(
        Identifier.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        either(
            sequence(
                Pattern.abstract,
                repeat(Attribute).abstract),
            sequence(
                always(null).abstract,
                repeat1(Attribute).abstract)))
    .map(flatten(1))
    .map(keep_abstract)
    .chain(list_into(FTL.Message)));

let Term = defer(() =>
    sequence(
        string("-"),
        Identifier.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        Value.abstract,
        repeat(Attribute).abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Term)));

/* -------------------------------------------------------------------------- */
/* Adjacent comment lines of the same comment type are joined together during
 * the AST construction. */
let CommentLine = defer(() =>
    sequence(
        either(
            string("###"),
            string("##"),
            string("#")).abstract,
        maybe(
            sequence(
                string(" "),
                regex(/.*/).abstract)),
        line_end)
    .map(flatten(1))
    .map(keep_abstract)
    .chain(list_into(FTL.Comment)));

/* ------------------------------------------------------------------------- */
/* Adjacent junk_lines are joined into FTL.Junk during the AST construction. */
let junk_line = defer(() =>
    sequence(
        regex(/.*/),
        line_end)
    .map(join)
    .chain(into(FTL.Junk)));

/* --------------------------------- */
/* Attributes of Messages and Terms. */
let Attribute = defer(() =>
    sequence(
        line_end,
        maybe(blank),
        string("."),
        Identifier.abstract,
        maybe(blank_inline),
        string("="),
        maybe(blank_inline),
        Pattern.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Attribute)));

/* ------------------------------------- */
/* Value types: Pattern and VariantList. */
let Value = defer(() =>
    either(
        Pattern,
        VariantList));

let Pattern = defer(() =>
    repeat1(
        PatternElement)
    // Flatten block_text and block_placeable which return lists.
    .map(flatten(1))
    .chain(list_into(FTL.Pattern)));

let VariantList = defer(() =>
    sequence(
        maybe(blank),
        string("{"),
        variant_list.abstract,
        maybe(blank),
        string("}"))
    .map(keep_abstract)
    .chain(list_into(FTL.VariantList)));

/* ----------------------------------------------------------------- */
/* TextElement and Placeable can occur inline or as block.
 * Text needs to be indented and start with a non-special character.
 * Placeables can start at the beginning of the line or be indented.
 * Adjacent TextElements are joined in AST creation. */

let PatternElement = defer(() =>
    either(
        inline_text,
        block_text,
        inline_placeable,
        block_placeable));

let inline_text = defer(() =>
    repeat1(text_char)
    .map(join)
    .chain(into(FTL.TextElement)));

let block_text = defer(() =>
    sequence(
        blank_block.chain(into(FTL.TextElement)).abstract,
        blank_inline,
        indented_char.chain(into(FTL.TextElement)).abstract,
        maybe(inline_text.abstract)
    )
    .map(keep_abstract));

let inline_placeable = defer(() =>
    sequence(
        string("{"),
        maybe(blank),
        either(
            // Order matters!
            SelectExpression,
            InlineExpression),
        maybe(blank),
        string("}"))
    .map(element_at(2))
    .chain(into(FTL.Placeable)));

let block_placeable = defer(() =>
    sequence(
        blank_block.chain(into(FTL.TextElement)).abstract,
        maybe(blank_inline),
        inline_placeable.abstract)
    .map(keep_abstract));

/* ------------------------------------------------------------------- */
/* Rules for validating expressions in Placeables and as selectors of
 * SelectExpressions are documented in spec/valid.md and enforced in
 * syntax/abstract.mjs. */
let InlineExpression = defer(() =>
    either(
        StringLiteral,
        NumberLiteral,
        VariableReference,
        CallExpression, // Must be before MessageReference
        AttributeExpression,
        VariantExpression,
        MessageReference,
        TermReference,
        inline_placeable));

/* -------- */
/* Literals */
let StringLiteral = defer(() =>
    sequence(
        string("\""),
        repeat(quoted_char),
        string("\""))
    .map(element_at(1))
    .map(join)
    .chain(into(FTL.StringLiteral)));

let NumberLiteral = defer(() =>
    sequence(
        maybe(string("-")),
        repeat1(digit),
        maybe(
            sequence(
                string("."),
                repeat1(digit))))
    .map(flatten(2))
    .map(join)
    .chain(into(FTL.NumberLiteral)));

/* ------------------ */
/* Inline Expressions */
let MessageReference = defer(() =>
    Identifier.chain(into(FTL.MessageReference)));

let TermReference = defer(() =>
    sequence(
        string("-"),
        Identifier)
    .map(element_at(1))
    .chain(into(FTL.TermReference)));

let VariableReference = defer(() =>
    sequence(
        string("$"),
        Identifier)
    .map(element_at(1))
    .chain(into(FTL.VariableReference)));

let CallExpression = defer(() =>
    sequence(
        Function.abstract,
        maybe(blank),
        string("("),
        maybe(blank),
        argument_list.abstract,
        maybe(blank),
        string(")"))
    .map(keep_abstract)
    .chain(list_into(FTL.CallExpression)));

let argument_list = defer(() =>
    sequence(
        repeat(
            sequence(
                Argument.abstract,
                maybe(blank),
                string(","),
                maybe(blank))),
        maybe(Argument.abstract))
    .map(flatten(2))
    .map(keep_abstract));

let Argument = defer(() =>
    either(
        NamedArgument,
        InlineExpression));

let NamedArgument = defer(() =>
    sequence(
        Identifier.abstract,
        maybe(blank),
        string(":"),
        maybe(blank),
        either(
            StringLiteral,
            NumberLiteral).abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.NamedArgument)));

let AttributeExpression = defer(() =>
    sequence(
        either(
            MessageReference,
            TermReference).abstract,
        string("."),
        Identifier.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.AttributeExpression)));

let VariantExpression = defer(() =>
    sequence(
        TermReference.abstract,
        VariantKey.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.VariantExpression)));

/* ----------------- */
/* Block Expressions */
let SelectExpression = defer(() =>
    sequence(
        InlineExpression.abstract,
        maybe(blank),
        string("->"),
        maybe(blank_inline),
        variant_list.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.SelectExpression)));

let variant_list = defer(() =>
    sequence(
        repeat(Variant).abstract,
        DefaultVariant.abstract,
        repeat(Variant).abstract,
        line_end)
    .map(keep_abstract)
    .map(flatten(1)));

let Variant = defer(() =>
    sequence(
        line_end,
        maybe(blank),
        VariantKey.abstract,
        maybe(blank_inline),
        Value.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Variant)));

let DefaultVariant = defer(() =>
    sequence(
        line_end,
        maybe(blank),
        string("*"),
        VariantKey.abstract,
        maybe(blank_inline),
        Value.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Variant))
    .map(mutate({default: true})));

let VariantKey = defer(() =>
    sequence(
        string("["),
        maybe(blank),
        either(
            NumberLiteral,
            Identifier),
        maybe(blank),
        string("]"))
    .map(element_at(2)));

/* ----------- */
/* Identifiers */

let Identifier =
    sequence(
        charset("a-zA-Z"),
        repeat(
            charset("a-zA-Z0-9_-")))
    .map(flatten(1))
    .map(join)
    .chain(into(FTL.Identifier));

let Function =
    sequence(
        charset("A-Z"),
        repeat(
            charset("A-Z_?-")))
    .map(flatten(1))
    .map(join)
    .chain(into(FTL.Function));

/* ---------- */
/* Characters */

/* Any Unicode character excluding C0 control characters (but including tab),
 * surrogate blocks and non-characters (U+FFFE, U+FFFF).
 * Cf. https://www.w3.org/TR/REC-xml/#NT-Char */
let regular_char =
    either(
        charset("\\u{9}\\u{20}-\\u{D7FF}\\u{E000}-\\u{FFFD}"),
        charset("\\u{10000}-\\u{10FFFF}"));

/* The opening brace in text starts a placeable. */
let special_text_char =
    string("{");

/* Double quote and backslash need to be escaped in string literals. */
let special_quoted_char =
    either(
        string("\""),
        string("\\"));

let text_char =
    and(
        not(special_text_char),
        regular_char);

/* Indented text may not start with characters which mark its end. */
let indented_char =
    and(
        not(string(".")),
        not(string("*")),
        not(string("[")),
        not(string("}")),
        text_char);

let literal_escape =
    sequence(
        string("\\"),
        special_quoted_char)
    .map(join);

let unicode_escape =
    sequence(
        string("\\u"),
        regex(/[0-9a-fA-F]{4}/))
    .map(join);

/* The literal opening brace { is allowed in string literals because they may
 * not have placeables. */
let quoted_char =
    either(
        and(
            not(special_quoted_char),
            text_char),
        special_text_char,
        literal_escape,
        unicode_escape);

let digit = charset("0-9");

/* ---------- */
/* Whitespace */
let blank_inline =
    repeat1(
        string("\u0020"))
    .map(join);

let line_end =
    either(
        // Normalize CRLF to LF.
        string("\u000D\u000A").map(() => "\n"),
        string("\u000A"),
        eof());

let blank_block =
    repeat1(
        sequence(
            maybe(blank_inline),
            line_end.abstract))
    .map(flatten(1))
    // Discard the indents and only keep the newlines
    // for multiline Patterns.
    .map(keep_abstract)
    .map(join);

let blank =
    repeat1(
        either(
            blank_inline,
            line_end));
