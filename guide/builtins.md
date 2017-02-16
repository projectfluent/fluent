Builtins
--------

emails = You have { $unreadEmails } unread emails.
emails2 = You have { NUMBER($unreadEmails) } unread emails.

last-notice =
    | Last checked: { DATETIME($lastChecked, day: "numeric", month: long") }.

```json
{
    "lastChecked": "2016-04-22T08:13:56.354Z",
    "unreadEmails": 5
}
```

In most cases, Fluent will automatically select the right formatter for the
argument and format it into a given locale.

In other cases, the developer will have to annotate the argument with additional
information on how to format it (see [Partial Arguments](functions.html#partial-arguments))

But in rare cases there may be a value for a localizer to select some formatting
options that are specific to the given locale.

Examples include: defining month as `short` or `long` in the `DATE`
formatter (using arguments defined in `Intl.DateTimeFormat`) or whether to use
grouping separator when displaying a large number.
