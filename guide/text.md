# Writing Text

Fluent is a file format designed for storing translations. In consequence,
text is the most important part of any Fluent file. Messages, terms, variants
and attributes all store their values as text. In Fluent, text values are
referred to as _patterns_.

## Placeables

In Fluent, text can interpolate values of other messages, as well as external
data passed into the translation from the app. Use the curly braces to start
and end interpolating another expression inside of a pattern:

```
# $title (String) - The title of the bookmark to remove.
remove-bookmark = Are you sure you want to remove { $title }?
```

Refer to the chapters about [placeables](placeables.html) for more
information.

## Multiline Text

Text can span multiple lines. In such cases, Fluent will calculate the common
indent of all indented lines and remove it from the final text value.

```
multi = Text can also span multiple lines as long as
    each new line is indented by at least one space.
    Because all lines in this message are indented
    by the same amount, all indentation will be
    removed from the final value.

indents =
    Indentation common to all indented lines is removed
    from the final text value.
      This line has 2 spaces in front of it.
```

Refer to the chapter about [multiline text](multiline.html) for more
information.
