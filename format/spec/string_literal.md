# StringLiteral

`StringLiterals` can be interpolated as `Placeables` inside `Patterns`. They
format to their text content.

```properties
test = {"Text"}
```
```json
{
    "value": "Text",
    "errors": []
}
```

All whitespace is preserved in `StringLiterals`.

```properties
test = A {"    "} B
```
```json
{
    "value": "A      B",
    "errors": []
}
```

When positioned at the front or at the end of a `Pattern`, `StringLiterals`
can be used to preserve leading and trailing whitespace which would be
otherwise trimmed inside `TextElement`.

```properties
test = {"    "}Text
```
```json
{
    "value": "    Text",
    "errors": []
}
```

```properties
test = Text{"    "}
```
```json
{
    "value": "Text    ",
    "errors": []
}
```

Curly braces, `LEFT CURLY BRACKET` (U+007B) and `RIGHT CURLY BRACKET` (U+007D), have no special meaning inside `StringLiterals`.

```properties
test = {"{braces}"}
```
```json
{
    "value": "{braces}",
    "errors": []
}
```


## Special Character Escape Sequences

Two characters are considered special in `StringLiterals` due to their
significance in the Fluent grammar.

- The double quote, `QUOTATION MARK` (U+0022), denotes the end of the
`StringLiteral`.

- The backslash, `REVERSE SOLIDUS` (U+005C), denotes the start of a known
escape sequence.

The double quote can be escaped by prefixing it with a backslash.

```properties
test = {"\""}
```
```json
{
    "value": "\"",
    "errors": []
}
```

The backslash itself can be escape by prefixing it with another backslash.

```properties
test = {"\\"}
```
```json
{
    "value": "\\",
    "errors": []
}
```

## Unicode Escape Sequences

Characters from the Basic Multilingual Plane (BMP) can be escaped using the
four-hexdigits escape sequences, starting with `\u`.

```properties
test = {"\u0041"}
```
```json
{
    "value": "A",
    "errors": []
}
```

Astral characters can be escaped using the six-hexdigit escape sequences,
starting with `\U`.

```properties
test = {"\U01F602"}
```
```json
{
    "value": "😂",
    "errors": []
}
```

An extra backslash can be used to escape the Unicode escape sequence and
produce a literal sequence of characters representing the Unicode escape
sequence.

```properties
test = {"\\U01F602"}
```
```json
{
    "value": "\\U01F602",
    "errors": []
}
```

## Unknown Escape Sequences

Escape sequences which do not adhere to the rules above are considered
unknown and do not result in any special behavior. No errors are produced.
Unknown escape sequences are considered valid textual content of
`StringLiterals`.

```properties
test = {"\a"}
```
```json
{
    "value": "\\a",
    "errors": []
}
```

```properties
test = {"\uXXXX"}
```
```json
{
    "value": "\uXXXX",
    "errors": []
}
```
