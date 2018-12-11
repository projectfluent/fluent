# Special Characters

In Fluent, text is the most important part of the file. As such, it doesn't
have any special syntax: you can just write it without any delimiters (e.g.
quotes). It also doesn't recognize any special escape sequences. Regular text
should be enough to store the vast majority of translations. In rare cases
when it's not, another type of text can be used: quoted text.

## Quoted Text

Quoted text uses double quotes as delimiters and cannot contain line breaks.
It can be used similar to how other types of expressions can: inside
of placeables (e.g. `{"abc"}`). It's rarely needed but can be used to insert
characters which are otherwise considered special by Fluent in the given
context. For instance, due to placeables using `{` and `}` as delimiters,
inserting a literal curly brace into the translation requires special care.
Quoted text can be effectively used for the purpose:

```
opening-brace = This message features an opening curly brace: {"{"}.
closing-brace = This message features a closing curly brace: {"}"}.
```

In the example above the `{"{"}` syntax can be read as a piece of quoted text
`"{"` being interpolated into regular text via the placeable syntax: `{…}`.
As can be seen from this example, curly braces carry no special meaning in
quoted text. As a result, quoted text cannot feature any interpolations.

The same strategy as above can be used to ensure blank space is preserved in
the translations:

```
blank-is-removed =     This message starts with no blanks.
blank-is-preserved = {"    "}This message starts with 4 spaces.
```

In very rare cases, you may need to resort to quoted text to use a literal
dot (`.`), star (`*`) or bracket (`[`) when they are used as the first
character on a new line. Otherwise, they would start a new attribute or a new
variant.

```
leading-bracket =
    This message has an opening square bracket
    at the beginning of the third line:
    {"["}.
```

```
attribute-how-to =
    To add an attribute to this messages, write
    {".attr = Value"} on a new line.
    .attr = An actual attribute (not part of the text value above)
```

## Escape Sequences

Quoted text supports a small number of escape sequences. The backslash
character (`\`) is used to start an escape sequence.

| Escape sequence | Meaning |
|-----------------|---------|
| `\"` | The literal double quote. |
| `\uHHHH` | A Unicode character in the U+0000 to U+FFFF range. |
| `\UHHHHHH` | Any Unicode character. |
| `\\` | The literal backslash. |

Escape sequences are rarely needed, but Fluent supports them for the sake of
edge-cases. In real life application using the actual character in the
regular text should be preferred.

```
# This is OK, but cryptic and hard to read and edit.
literal-quote1 = Text in {"\""}double quotes{"\""}.

# This is preferred. Just use the actual double quote character.
literal-quote2 = Text in "double quotes".
```

Quoted text should be used sparingly, most often in scenarios which call for
a special character, or when enclosing a characters in `{"` and `"}` makes
them easier to spot. For instance, the non-breaking space character looks
like a regular space in most text editors and it's easy to miss in a
translation. A Unicode escape sequence inside of a quoted text may be used
to make it stand out:

```
privacy-label = Privacy{"\u00A0"}Policy
```

A similar approach will make it clear which dash character is used in the
following example:

```
# The dash character is an EM DASH but depending on the font face,
# it might look like an EN DASH.
which-dash1 = It's a dash—or is it?

# Using a Unicode escape sequence makes the intent clear.
which-dash2 = It's a dash{"\u2014"}or is it?
```

Any Unicode character can be used in regular text values and in quoted text.
Unless readability calls for using the escape sequence, always prefer the
actual Unicode character.

```
# This will work fine, but the codepoint can be considered
# cryptic by other translators.
tears-of-joy1 = {"\U01F602"}

# This is preferred. You can instantly see what the Unicode
# character used here is.
tears-of-joy2 = 😂
```