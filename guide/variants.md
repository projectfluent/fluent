# Variants (Deprecated)

> Deprecation Notice: This syntax has been deprecated in Fluent Syntax 0.8
and it will be removed before Syntax 1.0. Variants have been superseded by
parameterized [Terms](terms.html).

Values of terms may have multiple variants, including the default variant
marked with an asterisk (`*`). Variants are essentially the same value, just
in slightly different forms to make it grammatically correct when used inside
of other messages. For instance, variants may correspond to different
grammatical cases required by the current language to build
grammatically-correct sentences.

When used as values of terms, variants can be defined without a selector.
Think of them as facets of the same message. You can refer to them using the
`identifier[variant key]` syntax.

```
-brand-name =
    {
       *[nominative] Firefox
        [accusative] Firefoxa
    }

app-title = { -brand-name }
restart-app = Zrestartuj { -brand-name[accusative] }.
```

In many inflected languages (e.g. German, Finnish, Hungarian, all Slavic
languages), the *about* preposition governs the grammatical case of the
complement. It might be accusative (German), ablative (Latin), or locative
(Slavic languages). The grammatical cases can be defined as variants without
a selector and referred to from other messages, like the `about` message
above.
