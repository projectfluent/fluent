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
                        return never(`Unknown comment sigil: ${sigil}`);
                }
            };
        case FTL.CallExpression:
            return ([callee, args]) => {
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
                    elements
                        .reduce(join_adjacent(FTL.TextElement), [])
                        .map(trim_text_at_extremes)
                        .filter(remove_empty_text)));
        case FTL.Resource:
            return entries =>
                always(new FTL.Resource(
                    entries
                        .reduce(join_adjacent(
                            FTL.Junk,
                            FTL.Comment,
                            FTL.GroupComment,
                            FTL.ResourceComment), [])
                        .reduce(attach_comments, [])
                        .filter(remove_blank_lines)));
        case FTL.SelectExpression:
            return ([selector, variants]) => {
                let invalid_selector_found =
                    selector instanceof FTL.MessageReference
                    || selector instanceof FTL.TermReference
                    || selector instanceof FTL.VariantExpression
                    || (selector instanceof FTL.AttributeExpression
                        && selector.ref instanceof FTL.MessageReference);
                if (invalid_selector_found) {
                    return never("Invalid selector type: ${selector.type}.");
                }
                let invalid_variants_found = variants.some(
                    variant => variant.value instanceof FTL.VariantList);
                if (invalid_variants_found) {
                    return never(
                        "VariantLists are only allowed inside of " +
                        "other VariantLists.");
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
        case FTL.Placeable:
            return expression => {
                let invalid_expression_found =
                    expression instanceof FTL.AttributeExpression
                    && expression.ref instanceof FTL.TermReference;
                if (invalid_expression_found) {
                    return never(
                        "Invalid expression type: ${expression.type}.");
                }
                return always(new Type(expression));
            };
        case FTL.TextElement:
            return value => {
                if (value === Symbol.for("eof")) {
                    return always(new Type(""));
                }
                return always(new Type(value));
            };
        default:
            return (...args) =>
                always(new Type(...args));
    }
}

function join_adjacent(...types) {
    return function(acc, cur) {
        let prev = acc[acc.length - 1];
        for (let Type of types) {
            if (prev instanceof Type && cur instanceof Type) {
                join_of_type(Type, prev, cur);
                return acc;
            }
        }
        return acc.concat(cur);
    };
}

function join_of_type(Type, ...elements) {
    // TODO Join annotations and spans.
    switch (Type) {
        case FTL.TextElement:
            return elements.reduce((a, b) =>
                (a.value += b.value, a));
        case FTL.Comment:
        case FTL.GroupComment:
        case FTL.ResourceComment:
            return elements.reduce((a, b) =>
                (a.content += `\n${b.content}`, a));
        case FTL.Junk:
            return elements.reduce((a, b) =>
                (a.content += b.content, a));
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

const LEADING_BLANK = /^[ \n\r]*/;
const TRAILING_BLANK = /[ \n\r]*$/;

function trim_text_at_extremes(element, index, array) {
    if (element instanceof FTL.TextElement) {
        if (index === 0) {
            element.value = element.value.replace(
                LEADING_BLANK, "");
        }
        if (index === array.length - 1) {
            element.value = element.value.replace(
                TRAILING_BLANK, "");
        }
    }
    return element;
}

function remove_empty_text(element) {
    // Keep Placeables and non-empty TextElements.
    return !(element instanceof FTL.TextElement)
        || element.value !== "";
}

function remove_blank_lines(element) {
    return typeof(element) !== "string";
}
