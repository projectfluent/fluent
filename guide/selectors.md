Selectors
---------

    emails = { $unreadEmails ->
        [one] You have one unread email.
       *[other] You have { $unreadEmails } unread emails.
    }

    {
        "unreadEmails": 5
    }

One of the most common cases when a localizer needs to use a placeable is when
there are multiple variants of the string that depend on some external
argument. FTL provides the select expression syntax, which chooses one of the
provided variants based on the given selector.

The selector may be a string in which case it will be compared directly to the
keys of variants defined in the select expression. For number selectors, the
variant keys either match the number exactly or they match the [CLDR plural
category](http://www.unicode.org/cldr/charts/30/supplemental/language_plural_rules.html)
for the number. The possible categories are: `zero`, `one`, `two`, `few`,
`many` and `other`. For instance, English has two plural categories: `one` and
`other`.

If the translation requires a number to be formatted in a particular
non-default manner, the selector should use the same formatting options. The
formatted number will then be used to choose the correct CLDR plural category
which for some languages might be different than the category of the
unformatted number:

    your-score = { NUMBER($score, minimumFractionDigits: 1) ->
        [0.0]   You scored zero points. What happened?
       *[other] You scored { NUMBER($score, minimumFractionDigits: 1) } points.
    }
