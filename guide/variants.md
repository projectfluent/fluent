Variants
--------
```
brand-name = {
   *[nominative] Aurora
    [genitive] Aurore
    [dative] Aurori
    [accusative] Auroro
    [locative] Aurori
    [instrumental] Auroro
}

about = O { brand-name[locative] }

```

As we stated at the beginning of this guide, messages primarely consist of
string values. A single string value can have multiple branches, or variants,
which are chosen based on the value of a selector. In some cases, however, we
don't need any selector and instead just want to define multiple variants of
the message and use them from within other messages. For instance. in languages
that use noun declension, `brand-name` may need to be declined when referred to
from other messages.

FTL lets you define variants without a selector. Think of them as facets of the
same message. You can refer to them using the `message[variant key]` syntax.

For instance, in many inflected languages (e.g. German, Finnish, Hungarian, all
Slavic languages), the *about* preposition governs the grammatical case of the
complement. It might be the accusative (German), the ablative (Latin) or the
locative (Slavic languages). The grammatical cases can be defined as variants
without a selector and referred to from other messages, like the `about`
message above.
