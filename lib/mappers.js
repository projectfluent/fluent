import {Abstract} from "./parser.js";

// Flatten a list up to a given depth.
// This is useful when a parser uses nested sequences and repeats.
export const flatten = depth =>
    list => list.reduce(
        (acc, cur) => acc.concat(
            !Array.isArray(cur) || depth === 1
                ? cur
                : flatten(depth - 1)(cur)),
        []);

// Mutate an object by merging properties of another object into it.
export const mutate = state =>
    obj => Object.assign(obj, state);

// Join the list of parsed values into a string.
export const join = list =>
    list
        .filter(value => value !== Symbol.for("eof"))
        .join("");

// Prune unmatched maybes from a list.
export const prune = list =>
    list.filter(value => value !== null);

// Map a list of {name, value} aliases into an array of values.
export const keep_abstract = list =>
    list
        .filter(value => value instanceof Abstract)
        .map(({value}) => value);

// Map a list to the element at the specified index. Useful for parsers which
// define a prefix or a surrounding delimiter.
export const element_at = index => list => list[index];

// Print the parse result of a parser.
export const print = x =>
    (console.log(JSON.stringify(x, null, 4)), x);
