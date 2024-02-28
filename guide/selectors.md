# Selectors

```
emails =
    { $unreadEmails ->
        [one] You have one unread email.
       *[other] You have { $unreadEmails } unread emails.
    }
```

One of the most common cases when a localizer needs to use a placeable is when
there are multiple variants of the string that depend on some external
variable. In the example above, the `emails` message depends on the value of
the `$unreadEmails` variable.

FTL has the select expression syntax which allows to define multiple variants
of the translation and choose between them based on the value of the
selector. The `*` indicator identifies the default variant. A default
variant is required.

The selector may be a string, in which case it will be compared directly to
the keys of variants defined in the select expression. For selectors which
are numbers, the variant keys either match the number exactly or they match
the [CLDR plural category][] for the number. The possible categories are:
`zero`, `one`, `two`, `few`, `many`, and `other`. For instance, English has
two plural categories: `one` and `other`.

If the translation requires a number to be formatted in a particular
non-default manner, the selector should use the same formatting options. The
formatted number will then be used to choose the correct CLDR plural category
which, for some languages, might be different than the category of the
unformatted number:

```
your-score =
    { NUMBER($score, minimumFractionDigits: 1) ->
        [0.0]   You scored zero points. What happened?
       *[other] You scored { NUMBER($score, minimumFractionDigits: 1) } points.
    }
```

Using formatting options also allows for selectors using ordinal rather than
cardinal plurals:

```
your-rank = { NUMBER($pos, type: "ordinal") ->
   [1] You finished first!
   [one] You finished {$pos}st
   [two] You finished {$pos}nd
   [few] You finished {$pos}rd
  *[other] You finished {$pos}th
}
```

[CLDR plural category]: https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
