# Working With Text

Fluent is a file format desgined for storing translations. In consequence,
text is the most important part of any Fluent file. Messages, terms, variants
and attributes all store their values as text. In Fluent, text values are
referred to as _patterns_.

## Interpolation

In Fluent, text can interpolate values of other messages, as well as external
data passed into the translation from the app. Use the curly braces to start
and end interpolating another value inside of text:

```
menu-save = Save
help-menu-save = Click "{ menu-save }" to save the file.
```

```
# $title is the title of the bookmark to remove.
remove-bookmark = Really remove { $title }?
```

Refer to chapters about [referencing messages](references.html) and
[iterpolating variables](variables.html) for more information.

## Multiline Text

Text can span multiple lines as long as it is indented by at least one space.

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
another rule; see the `multiline2` message below.

```
leading-spaces =     This message's value starts with the word "This".
leading-lines =


    This message's value als starts with the word "This".
    The blank lines under the identifier are ignored.
```

In multiline patterns, the maximum indent common to all indented lines is
ignored when the text value is spread across multiple indented lines.

```
multiline1 =
    This message has four spaces of indent
        on the second line of its value.
```

You can visualize this behavior in the following manner:

```
# █ denotes a single space of the indent common to all lines.
# · denotes a single space of the indent preserved in the value.
multiline1 =
████This message has four spaces of indent
████····on the second line of its value.
```

This behavior also applies when the first line of a text block is indented
relative to the following lines. This is the only case where a sequence of
leading blank characters might be preserved as part of the text value, even
if they're technically in the leading position.

```
multiline2 =
        This message has four spaces of indent
    on the first line of its value. Only the first
    four spaces of the indent on the first line are
    removed as common to all indented lines.
```

Only the indented lines comprising the multiline pattern participate in this
behavior. Specifically, if the text starts on the same line as the message
identifier, then this first line is not considered as indented, and is
excluded from the dedentation behavior. In such cases, the first line (the
unindeted one) still has its leading blanks ignored—because patterns start
on the first non-blank character.

```
multiline3 = This message has four spaces of indent
        on the second line of its value. The first
    line is not considered indented at all.

# Same value as multiline3 above.
multiline4 =     This message has four spaces of indent
        on the second line of its value. The first
    line is not considered indented at all.
```

Note that if a multiline pattern starts on the same line as the identifier
and it only consists of one more line of text below it, then the maximum
indent common to all _indented_ lines is equal to the indent of the second
line, i.e. the only indented line. All indent will be removed in this case.

```
multiline5 = This message has no indent
        on the second line of its value.
```
