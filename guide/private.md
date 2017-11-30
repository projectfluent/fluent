# Private Messages

```
-brand-name = Firefox

app-title = { -brand-name }
has-updated = { -brand-name } has been updated.
```

Private messages are similar to regular messages but they can only be used as
references in other messages. Their identifiers start with at least one dash
`-` like in the example above: `-brand-name`. The runtime cannot retrieve
private messages directly. They are best used to define terms which can be
used consistently across the localization of the entire product.

Private messages can store some grammatical information about themselves in
[tags](tags.html) which are the topic of the next chapter.

Private messages are not allowed to have [attributes](attributes.html).
