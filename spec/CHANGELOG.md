# Changelog

## Unreleased

  - Introduce tags for language-specific grammatical information.

    Tags are binary values attached to messages.  They are language-specific and
    can be used to describe grammatical characteristics of the message.

        brand-name = Firefox
            #masculine

        brand-name = Aurora
            #feminine
            #vowel

    Tags can be used in select expressions by matching a hashtag name to the
    message:

        has-updated = { brand-name ->
                [masculine] …
                [feminine] …
               *[other] …
            }

    Tags can only be defined on messages which have a value and don't have any
    attributes.

  - Require the message body to be indented.

    Quoted strings are now only valid in placeables and cannot contain other
    placeables.

    Remove `|` for multiline blocks.

  - (f176deb) Fix #30. Allow more characters in keys, and trim whitespace
    around them

    Introduce `word` which replaces `keyword` and changes its semantics:
    `words` cannot contain spaces.  Space-separated sequences of `words` are
    called `symbols`.

    `variant-key` may now be a `number` or a `symbol`.

    `Keyword` is now called `Symbol` in ASDL.

  - (9ef5543) Fix #28. Use // as the sigil for comments
  - (52a04f4) Document the ASDL and use more explicit filed names

    Rename `SelectExpression`'s `expr` field to `expression`.  Rename `Junk`'s
    and `Comment`s `body` fields to `content`.

  - (5201845) Rename `keyword-argument` to `named-argument`

  - (529600f) Remove the list data type

    Remove `LIST`, `LEN`, `TAKE`, `DROP`.

## 0.2.0

  - (9453242, 1d55148) Simplify Expressions

    ASDL's `elem` and `expr` types were merged into a single `expr` type.
    `Pattern` is now now part of `expr`.

    `KeyValueArgument` is no longer an `Expression` and is now called
    `NamedArgument`.

    `CallExpression's callee is now a new type: `fun`.

    EBNF's `variable` is now called `external`.

  - (fbcdc07) Fix #10. Remove Section's body

    The list of entries in `Resource.body` is now guaranteed to be flat.

  - (7120a0d) Remove dot as a valid character in builtin names
  - (78ceed8) Fix #6. New syntax for attributes

    Replace traits which used the `[key] value` syntax with `attributes`:

        foo
            .attr = An attribute

  - (a183bef) Fix #5. Allow select-expression with an empty selector
  - (26ec797) Fix #3. Use { and } for explicit grouping
  - (402cc2b) Fix #8. Forbid patterns as values of `name-arguments`.
  - (a5811e1) Fix #2. Disallow multiple expressions in a placeable.
  - (35d6ebe) Fix #1. Require one variant to be default.
  - (104e11b) Use `:` between the name and the value of a `named-argument`.
  - (ab27e60) Use W3C's EBNF

## 0.1.0

  - (be77dbb) Add ASDL description of the Fluent syntax.

    This is the intial release corresponding to FTL as implemented in `l20n.js`
    as of January 2017 and in the JavaScript implementation of Project Fluent:
    `fluent@0.1.0`.
