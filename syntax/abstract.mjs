import * as FTL from "./ast.mjs";
import {always, never} from "../lib/combinators.mjs";

export function list_into(Type) {
    switch (Type) {
        case FTL.CallExpression:
            return ([callee, args]) => {
                let positional = [];
                let named = [];
                for (let arg of args) {
                    if (arg instanceof FTL.NamedArgument) {
                        named.push(arg);
                    } else if (named.length > 0) {
                        return never(
                            "Positional arguments must not follow " +
                            "named arguments.");
                    } else {
                        positional.push(arg);
                    }
                }
                return always(new Type(callee, positional, named));
            };
        case FTL.Message:
            return ([comment, ...args]) =>
                always(new Type(...args, comment));
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
                        .reduce(join_adjacent(FTL.Junk), [])
                        .filter(remove_blank_lines)));
        case FTL.Term:
            return ([comment, ...args]) =>
                always(new Type(...args, comment));
        default:
            return elements =>
                always(new Type(...elements));
    }
}

export function into(Type) {
    return (...args) => always(new Type(...args));
}

function join_adjacent(Type) {
    return function(acc, cur) {
        let prev = acc[acc.length - 1];
        if (prev instanceof Type && cur instanceof Type) {
            join_of_type(Type, prev, cur);
            return acc;
        } else {
            return acc.concat(cur);
        }
    };
}

function join_of_type(Type, ...elements) {
    // TODO Join annotations and spans.
    switch (Type) {
        case FTL.TextElement:
            return elements.reduce((a, b) =>
                (a.value += b.value, a));
        case FTL.Junk:
            return elements.reduce((a, b) =>
                (a.content += b.content, a));
    }
}

function trim_text_at_extremes(element, index, array) {
    if (element instanceof FTL.TextElement) {
        if (index === 0) {
            element.value = element.value.trimLeft();
        }
        if (index === array.length - 1) {
            element.value = element.value.trimRight();
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
