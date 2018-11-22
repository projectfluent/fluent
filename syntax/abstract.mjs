/*
 * AST Validation
 *
 * The parse result of the grammar.mjs parser is a well-formed AST which is
 * validated according to the rules documented in `spec/valid.md`.
 */

import * as FTL from "./ast.mjs";
import {always, never} from "../lib/combinators.mjs";

export function list_into(Type) {
    switch (Type) {
        case FTL.AttributeExpression:
            return ([ref, name]) => {
                let ref_is_valid =
                    ref instanceof FTL.MessageReference
                    || ref instanceof FTL.TermReference;
                if (ref_is_valid) {
                    return always(new Type(ref, name));
                }
                return never(`Invalid ref type: ${ref.type}.`);
            };
        case FTL.Comment:
            return ([sigil, content = ""]) => {
                switch (sigil) {
                    case "#":
                        return always(new FTL.Comment(content));
                    case "##":
                        return always(new FTL.GroupComment(content));
                    case "###":
                        return always(new FTL.ResourceComment(content));
                    default:
                        return never(`Unknown comment sigil: ${sigil}.`);
                }
            };
        case FTL.CallExpression:
            return ([callee, args]) => {
                let callee_is_valid =
                    callee instanceof FTL.FunctionReference
                    || callee instanceof FTL.TermReference
                    || (callee instanceof FTL.AttributeExpression
                        && callee.ref instanceof FTL.TermReference);
                if (!callee_is_valid) {
                    return never(`Invalid callee type: ${callee.type}.`);
                }
                let positional_args = [];
                let named_map = new Map();
                for (let arg of args) {
                    if (arg instanceof FTL.NamedArgument) {
                        let name = arg.name.name;
                        if (named_map.has(name)) {
                            return never("Named arguments must be unique.");
                        }
                        named_map.set(name, arg);
                    } else if (named_map.size > 0) {
                        return never(
                            "Positional arguments must not follow " +
                            "named arguments.");
                    } else {
                        positional_args.push(arg);
                    }
                }
                let named_args = Array.from(named_map.values());
                return always(new Type(callee, positional_args, named_args));
            };
        case FTL.Pattern:
            return elements =>
                always(new FTL.Pattern(
                    dedent(elements)
                        .reduce(join_adjacent(FTL.TextElement), [])
                        .map(trim_text_at_extremes)
                        .filter(remove_empty_text)));
        case FTL.Resource:
            return entries =>
                always(new FTL.Resource(
                    entries
                        .reduce(join_adjacent(
                            FTL.Comment,
                            FTL.GroupComment,
                            FTL.ResourceComment), [])
                        .reduce(attach_comments, [])
                        .filter(remove_blank_lines)));
        case FTL.SelectExpression:
            return ([selector, variants]) => {
                let selector_is_valid =
                    selector instanceof FTL.StringLiteral
                    || selector instanceof FTL.NumberLiteral
                    || selector instanceof FTL.VariableReference
                    || (selector instanceof FTL.AttributeExpression
                        && selector.ref instanceof FTL.TermReference)
                    || (selector instanceof FTL.CallExpression
                        && selector.callee instanceof FTL.FunctionReference)
                    || (selector instanceof FTL.CallExpression
                        && selector.callee instanceof FTL.AttributeExpression);
                if (!selector_is_valid) {
                    return never(`Invalid selector type: ${selector.type}.`);
                }

                return always(new Type(selector, variants));
            };
        case FTL.VariantList:
            return ([variants]) =>
                always(new Type(variants));
        default:
            return elements =>
                always(new Type(...elements));
    }
}

export function into(Type) {
    switch (Type) {
        case FTL.FunctionReference:
            const VALID_FUNCTION_NAME = /^[A-Z][A-Z0-9_?-]*$/;
            return identifier => {
                if (VALID_FUNCTION_NAME.test(identifier.name)) {
                    return always(new Type(identifier));
                }
                return never(
                    `Invalid function name: ${identifier.name}. `
                    + "Function names must be all upper-case ASCII letters.");
            };
        case FTL.Placeable:
            return expression => {
                let invalid_expression_found =
                    expression instanceof FTL.FunctionReference
                    || (expression instanceof FTL.AttributeExpression
                        && expression.ref instanceof FTL.TermReference)
                    || (expression instanceof FTL.CallExpression
                        && expression.callee instanceof FTL.AttributeExpression);
                if (invalid_expression_found) {
                    return never(
                        `Invalid expression type: ${expression.type}.`);
                }
                return always(new Type(expression));
            };
        case FTL.StringLiteral:
            return raw =>
                always(new Type(raw, unescape(raw)));
        default:
            return (...args) =>
                always(new Type(...args));
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
        case FTL.TextElement:
            return elements.reduce((a, b) =>
                new Type(a.value + b.value));
        case FTL.Comment:
        case FTL.GroupComment:
        case FTL.ResourceComment:
            return elements.reduce((a, b) =>
                new Type(a.content + "\n" + b.content));
    }
}

function attach_comments(acc, cur) {
    let prev = acc[acc.length - 1];
    if (prev instanceof FTL.Comment
        && (cur instanceof FTL.Message
            || cur instanceof FTL.Term)) {
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
            return new FTL.TextElement(element.slice(common));
        }
        return element;
    }

    return elements.map(trim_indents);
}

const LEADING_BLANK_BLOCK = /^\n*/;
const TRAILING_BLANK_INLINE = / *$/;

function trim_text_at_extremes(element, index, array) {
    if (element instanceof FTL.TextElement) {
        if (index === 0) {
            element.value = element.value.replace(
                LEADING_BLANK_BLOCK, "");
        }
        if (index === array.length - 1) {
            element.value = element.value.replace(
                TRAILING_BLANK_INLINE, "");
        }
    }
    return element;
}

function remove_empty_text(element) {
    return !(element instanceof FTL.TextElement)
        || element.value !== "";
}

function remove_blank_lines(element) {
    return typeof(element) !== "string";
}

// Backslash backslash, backslash double quote, uHHHH, UHHHHHH.
const KNOWN_ESCAPES =
    /(?:\\\\|\\\"|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;

function unescape(raw) {
    return raw.replace(KNOWN_ESCAPES, from_escape_sequence);
}

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
