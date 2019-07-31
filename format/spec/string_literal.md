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

## Escape Sequences

Escape sequences are supported in `StringLiterals`.

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

A double-backslash can be used to obtain a single backslash in the formatting output.

```properties
test = {"\\U01F602"}
```

```json
{
    "value": "\\U01F602",
    "errors": []
}
```
