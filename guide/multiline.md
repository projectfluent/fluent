# Multiline Text

Text can span multiple lines as long as it is indented by at least one space.
Only the space character (`U+0020`) can be used for indentation. Fluent
treats tab characters as regular text.

```
single = Text can be written in a single line.

multi = Text can also span multiple lines
    as long as each new line is indented
    by at least one space.

block =
    Sometimes it's more readable to format
    multiline text as a "block", which means
    starting it on a new line. All lines must
    be indented by at least one space.
```

In almost all cases, patterns start at the first non-blank character and
end at the last non-blank character. In other words, the leading and
trailing blanks are ignored. There's one exception to this rule, due to
another rule which we'll cover below (in the `multiline2` example).

```
leading-spaces =     This message's value starts with the word "This".
leading-lines =


    This message's value starts with the word "This".
    The blank lines under the identifier are ignored.
```

Line breaks and blank lines are preserved as long as they are positioned
inside of multiline text, i.e. there's text before and after them.

```
blank-lines =

    The blank line above this line is ignored.
    This is a second line of the value.

    The blank line above this line is preserved.
```

In multiline patterns, all common indent is removed when the text value is
spread across multiple indented lines.

```
multiline1 =
    This message has 4 spaces of indent
        on the second line of its value.
```

We can visualize this behavior in the following manner and we'll use this
convention in the rest of this chapter:

```
# █ denotes the indent common to all lines (removed from the value).
# · denotes the indent preserved in the final value.
multiline1 =
████This message has 4 spaces of indent
████····on the second line of its value.
```

This behavior also applies when the first line of a text block is indented
relative to the following lines. This is the only case where a sequence of
leading blank characters might be preserved as part of the text value, even
if they're technically in the leading position.

```
multiline2 =
████··This message starts with 2 spaces on the first
████first line of its value. The first 4 spaces of indent
████are removed from all lines.
```

Only the indented lines comprising the multiline pattern participate in this
behavior. Specifically, if the text starts on the same line as the message
identifier, then this first line is not considered as indented, and is
excluded from the dedentation behavior. In such cases, the first line (the
unindented one) still has its leading blanks ignored—because patterns start
on the first non-blank character.

```
multiline3 = This message has 4 spaces of indent
████····on the second line of its value. The first
████line is not considered indented at all.

# Same value as multiline3 above.
multiline4 =     This message has 4 spaces of indent
████····on the second line of its value. The first
████line is not considered indented at all.
```

Note that if a multiline pattern starts on the same line as the identifier
and it only consists of one more line of text below it, then the indent
common to all _indented_ lines is equal to the indent of the second line,
i.e. the only indented line. All indent will be removed in this case.

```
multiline5 = This message ends up having no indent
████████on the second line of its value.
```
