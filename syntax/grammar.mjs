import * as FTL from "./ast.mjs";
import {list_into, into} from "./abstract.mjs";
import {
    always, and, charset, defer, either, eof, maybe, not,
    regex, repeat, repeat1, sequence, string
} from "../lib/combinators.mjs";
import {
    element_at, flatten, join, keep_abstract, mutate, print
} from "../lib/mappers.mjs";

/* ------------------------------- */
/* An FTL file defines a Resource. */
export
let Resource = defer(() =>
    repeat(
        either(
            blank_line,
            Entry,
            junk_line))
    .chain(list_into(FTL.Resource)));

export
let Entry = defer(() =>
    either(
        Message,
        Term,
        either(
            ResourceComment,
            GroupComment,
            Comment)));

let Message = defer(() =>
    sequence(
        maybe(Comment).abstract,
        Identifier.abstract,
        maybe(inline_space),
        string("="),
        maybe(inline_space),
        either(
            sequence(
                Pattern.abstract,
                repeat(Attribute).abstract),
            sequence(
                always(null).abstract,
                repeat1(Attribute).abstract)),
        line_end)
    .map(flatten(1))
    .map(keep_abstract)
    .chain(list_into(FTL.Message)));

let Term = defer(() =>
    sequence(
        maybe(Comment).abstract,
        TermIdentifier.abstract,
        maybe(inline_space),
        string("="),
        maybe(inline_space),
        Value.abstract,
        repeat(Attribute).abstract,
        line_end)
    .map(keep_abstract)
    .chain(list_into(FTL.Term)));

let Comment = defer(() =>
    repeat1(
        sequence(
            string("#"),
            comment_line.abstract))
    .map(flatten(1))
    .map(keep_abstract)
    .map(join)
    .chain(into(FTL.Comment)));

let GroupComment = defer(() =>
    repeat1(
        sequence(
            string("##"),
            comment_line.abstract))
    .map(flatten(1))
    .map(keep_abstract)
    .map(join)
    .chain(into(FTL.GroupComment)));

let ResourceComment = defer(() =>
    repeat1(
        sequence(
            string("###"),
            comment_line.abstract))
    .map(flatten(1))
    .map(keep_abstract)
    .map(join)
    .chain(into(FTL.ResourceComment)));

/* ----------------------------------------------------------------- */
/* Adjacent junk_lines should be joined into FTL.Junk during the AST
   construction. */
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
        break_indent,
        string("."),
        Identifier.abstract,
        maybe(inline_space),
        string("="),
        maybe(inline_space),
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
    // Flatten indented Placeables.
    .map(flatten(1))
    .chain(list_into(FTL.Pattern)));

let VariantList = defer(() =>
    sequence(
        maybe(space_indent),
        string("{"),
        variant_list.abstract,
        string("}"))
    .map(keep_abstract)
    .chain(list_into(FTL.VariantList)));

let PatternElement = defer(() =>
    either(
        TextElement,
        Placeable,
        sequence(
            // Trimmed or joined into a preceding FTL.TextElement during the
            // AST construction.
            break_indent.chain(into(FTL.TextElement)),
            Placeable)));

let TextElement = defer(() =>
    repeat1(
        either(
            text_char,
            text_cont))
    .map(join)
    .chain(into(FTL.TextElement)));

let Placeable = defer(() =>
    sequence(
        string("{"),
        maybe(inline_space),
        either(
            // Order matters!
            SelectExpression,
            InlineExpression),
        maybe(inline_space),
        string("}"))
    .map(element_at(2))
    .chain(into(FTL.Placeable)));

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
        Placeable));

/* -------- */
/* Literals */
let StringLiteral = defer(() =>
    sequence(
        quote,
        repeat(quoted_text_char),
        quote)
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
    TermIdentifier.chain(into(FTL.TermReference)));

let VariableReference = defer(() =>
    VariableIdentifier.chain(into(FTL.VariableReference)));

let CallExpression = defer(() =>
    sequence(
        Function.abstract,
        string("("),
        maybe(space_indent),
        argument_list.abstract,
        maybe(space_indent),
        string(")"))
    .map(keep_abstract)
    .chain(list_into(FTL.CallExpression)));

let argument_list = defer(() =>
    sequence(
        repeat(
            sequence(
                Argument.abstract,
                maybe(space_indent),
                string(","),
                maybe(space_indent))),
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
        maybe(space_indent),
        string(":"),
        maybe(space_indent),
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
        maybe(inline_space),
        string("->"),
        variant_list.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.SelectExpression)));

let variant_list = defer(() =>
    sequence(
        maybe(inline_space),
        repeat(Variant).abstract,
        DefaultVariant.abstract,
        repeat(Variant).abstract,
        break_indent)
    .map(keep_abstract)
    .map(flatten(1)));

let Variant = defer(() =>
    sequence(
        break_indent,
        VariantKey.abstract,
        maybe(inline_space),
        Value.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Variant)));

let DefaultVariant = defer(() =>
    sequence(
        break_indent,
        string("*"),
        VariantKey.abstract,
        maybe(inline_space),
        Value.abstract)
    .map(keep_abstract)
    .chain(list_into(FTL.Variant))
    .map(mutate({default: true})));

let VariantKey = defer(() =>
    sequence(
        string("["),
        maybe(inline_space),
        either(
            NumberLiteral,
            VariantName),
        maybe(inline_space),
        string("]"))
    .map(element_at(2)));

let VariantName = defer(() =>
    sequence(
        word,
        repeat(
            sequence(
                inline_space,
                word)))
    .map(flatten(2))
    .map(join)
    .chain(into(FTL.VariantName)));

/* ----------- */
/* Identifiers */

let Identifier = defer(() =>
    identifier.chain(into(FTL.Identifier)));

let TermIdentifier = defer(() =>
    sequence(
        string("-"),
        identifier)
    .map(join)
    .chain(into(FTL.Identifier)));

let VariableIdentifier = defer(() =>
    sequence(
        string("$"),
        identifier)
    .map(element_at(1))
    .chain(into(FTL.Identifier)));

let Function =
    sequence(
        charset("A-Z"),
        repeat(
            charset("A-Z_?-")))
    .map(flatten(1))
    .map(join)
    .chain(into(FTL.Function));

/* ------ */
/* Tokens */
let identifier =
    sequence(
        charset("a-zA-Z"),
        repeat(
            charset("a-zA-Z0-9_-")))
    .map(flatten(1))
    .map(join);

let comment_line = defer(() =>
    either(
        sequence(
            line_end.abstract),
        sequence(
            string(" "),
            regex(/.*/).abstract,
            line_end.abstract))
    .map(keep_abstract)
    .map(join));

let word = defer(() =>
    repeat1(
        and(
            not(string("[")),
            not(string("]")),
            not(string("{")),
            not(string("}")),
            not(backslash),
            regular_char))
    .map(join));

/* ---------- */
/* Characters */

let backslash = string("\\");
let quote = string("\"");

/* Any Unicode character from BMP excluding C0 control characters, space,
 * surrogate blocks and non-characters (U+FFFE, U+FFFF).
 * Cf. https://www.w3.org/TR/REC-xml/#NT-Char
 * TODO Add characters from other planes: U+10000 to U+10FFFF.
 */
let regular_char =
    charset("\u0021-\uD7FF\uE000-\uFFFD");

let text_char = defer(() =>
    either(
        inline_space,
        regex(/\\u[0-9a-fA-F]{4}/),
        sequence(
            backslash,
            backslash).map(join),
        sequence(
            backslash,
            string("{")).map(join),
        and(
            not(backslash),
            not(string("{")),
            regular_char)));

let text_cont = defer(() =>
    sequence(
        break_indent,
        and(
            not(string(".")),
            not(string("*")),
            not(string("[")),
            not(string("}")),
            text_char))
    .map(join));

let quoted_text_char =
    either(
        and(
            not(quote),
            text_char),
        sequence(
            backslash,
            quote).map(join));

let digit = charset("0-9");

/* ---------- */
/* Whitespace */
let inline_space =
    repeat1(
        either(
            string("\u0020"),
            string("\u0009")))
    .map(join);

let line_end =
    either(
        string("\u000D\u000A"),
        string("\u000A"),
        string("\u000D"),
        eof());

let blank_line =
    sequence(
        maybe(inline_space),
        line_end)
    .map(join);

let break_indent =
    sequence(
        line_end,
        repeat(blank_line),
        inline_space)
    .map(flatten(1))
    // Trim the indents. Keep only the newlines.
    .map(indents => indents.fill("").join("\n"));

let space_indent =
    sequence(
        maybe(inline_space),
        maybe(break_indent));
