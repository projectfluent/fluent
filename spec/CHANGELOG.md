# Changelog


## Unreleased

  - Remove support for CR as a line ending. (#154)

## 0.6.0 (July 24, 2018)

  - Created the reference parser for Fluent Syntax.

    This version is the first to ship with the official reference
    implementation of the parser. The parser focuses on strictness and
    correctness at a cost of reduced performance.

    The ASDL description of the AST has been removed in favor of
    `syntax/ast.mjs` which defines the actual AST nodes returned by the
    reference parser.

    The EBNF is now auto-generated from the reference parser's
    `syntax/grammar.mjs` file. It provides an easy to read overview of the
    grammar and will continue to be updated in the future.

    Going forward, all changes to the grammar will be implemented in the
    reference parser first, which also ships with an extensive test suite.

  - Added junk entries.

    The grammar now explicitly defines the `junk_line` production which is
    converted into `Junk` during the AST construction.

  - Comments may now be attached to Messages or Terms.

    The grammar now encodes the behavior for Comments preceding Messages and
    Terms. If there are no blank lines between the Comment and the Message or
    the Term, the Comment becomes part of the `Message` or the `Term` AST node.

  - Fixed many issues with the white-space grammar.

    The EBNF for Syntax 0.5 had many issues with its use of `inline-space` and
    `break-indent`. It defined undesirable or impossible parsing behavior.
    These issues have been fixed and the new test suite will help ensure the
    correctness of the grammar in the future.

  - Named arguments to `CallExpressions` must now follow all positional ones.

    The order of arguments to `CallExpressions` is now strictly defined as
    positional first, named second. The `CallExpression`'s `arguments` field
    was replaced by two new fields: `positional` and `named`.

  - Named arguments to `CallExpressions` must now be unique.

  - Added the `TermReference` expression.

    References to terms used to be stored as `MessageReferences` in the AST.
    They now have their own expression type.

  - Store the referent expression in attribute and variant expressions.

    `MessageAttributeExpression`, `TermAttributeExpression` and
    `TermVariantExpression` now store the entire referent expression in a new
    `ref` field, rather than just the `Identifier`.

  - `ExternalArgument` is now called `VariableReference`.

  - Add the `VariantList` value type.

    Selector-less `SelectExpressions` have been removed in favor of
    `VariantLists` which share the same syntax but have more restricted usage.
    Values of `Messages` and all `Attributes` may only be `Patterns`.  Values
    of `Terms` may either be `Patterns` or `VariantLists`.  Values of
    `Variants` may only be `VariantLists` if they're defined in another
    `VariantList`.

  - `StringExpression` is now called `StringLiteral`.

  - `NumberExpression` is now called `NumberLiteral`.

  - `TextElement` and `Placeable` are now subclasses of an abstract
    `PatternElement` class.


## 0.5.0 (January 31, 2018)

  - Added terms. (#62, #85)

    Terms are entries which can only be referenced by other messages. Terms
    cannot be retrieved by the `MessageContext` runtime.

    Terms start their identifiers with a single dash `-`. Tools may introduce
    different checks for messages and terms.

  - Removed tags. (#67)

    The same functionality can be achieved by using term attributes.

    ```properties
    -brand-name = Firefox
        .gender = masculine

    has-updated =
        { -brand-name.gender ->
            [masculine] { -brand-name} został zaktualizowany.
            [feminine] { -brand-name } została zaktualizowana.
           *[other] Program { -brand-name } został zaktualizowany.
        }
    ```

  - Changed the comment sigil to `#`. (#58)

  - Removed sections and introduced group and resource comments. (#58)

    Comments starting with `##` and `###` define the outline of the file and
    replace sections. `##` denotes group-level comments (`GroupComment` in
    ASDL) and `###` denotes resource-level comments (`ResourceComment`).
    These are always standalone `Comment` entries.

    The `comment` field on the `Resource` node was removed.

  - Require `=` after the identifier in message definitions. (#63)

  - Renamed `Symbol` to `VariantName` in the ASDL.

## 0.4.0 (November 14, 2017)

  - Added the `Placeable` production as a wrapper for expressions in patterns.

    This allows storing more precise information about the whitespace around
    the placeable's braces.

  - Separated the `expr` type into `inline_expr` and `block_expr`.

    This mirrors the EBNF, where a select expression cannot by an argument to
    a call expression nor selector of another select expression without being
    wrapped in braces.

  - The dash `-` is not allowed at the beginning of identifiers.

    There's an ongoing discussion in #62 about using the leading `-` for
    private messages (terms) in the future.

  - The question mark `?` is not allowed in identifiers.

    We want to start with a more strict syntax for identifiers. See the
    discussion in #65.

  - Small EBNF fixes:

    - Allowed multiline comments.
    - Allowed inline space in blank lines between entries.

## 0.3.0

  - Added tags for language-specific grammatical information.

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

  - The message body must be indented now.

    Quoted strings are now only valid in placeables and cannot contain other
    placeables.  Removed `|` for multiline blocks.

  - Added `TextElement` production for text elements of the `Pattern`.

  - Added `annotations` and `span` to all `entry` types.

    Spans are `{ start, end }` productions. Annotations are `{ code, args,
    message, span }` productions.

  - Allowed more characters in keys.

    Variant keys are now trimmed from both sides.

    Introduced `word` which replaces `keyword` and changes its semantics:
    `words` cannot contain spaces.  Space-separated sequences of `words` are
    called `symbols`.

    `variant-key` may now be a `number` or a `symbol`.

    `Keyword` is now called `Symbol` in ASDL.

  - Defined the behavior of backslash escapes as follows:

    - Escape sequences are only allowed in `text` and `quoted-text`.

    - Newlines are preserved by the parser. This allows proper serialization.

    - Known escape sequences are: `\\` for the literal backslash, `\"` for the
      literal double quote, `\{` for the literal opening brace and `\u`
      followed by 4 hex digits for Unicode code points. Representing code
      points from outside of the Basic Multilingual Plane is made possible with
      surrogate pairs (two `\uXXXX` sequences). Using the actual character is
      encouraged, however.

    - Any other escaped characters result in a parsing error.

  - Changed the sigil for comments to `//`.
  - Renamed `SelectExpression`'s `expr` field to `expression`.
  - Renamed `Junk`'s and `Comment`s `body` fields to `content`.
  - Renamed `CallExpression`'s `args` field to `arguments`.
  - Renamed `NamedArgument`'s `val` field to `value`.
  - Renamed `keyword-argument` to `named-argument`
  - Removed the list data type

    Removed `LIST`, `LEN`, `TAKE`, `DROP`.

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
