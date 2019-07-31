# TextElement

Patterns are composed of `PatternElements`, which can be `TextElements` or
`Placeables`. `TextElements` represent the verbatim content of the
translation.

```properties
test = Text
```

```json
{
    "value": "Text",
    "errors": []
}
```

Multiline `TextElements` must be formatted without changes to newlines and
whitespace.

```properties
test =
    Multiline
      Content
```

```json
{
    "value": "Multiline\n  Content",
    "errors": []
}
```
