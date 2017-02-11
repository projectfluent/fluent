Builtins
--------

    emails = You have { $unreadEmails } unread emails.
    emails2 = You have { NUMBER($unreadEmails) } unread emails.

    last-notice =
        | Last checked: { DATETIME($lastChecked, day: "numeric", month: long") }.

    {
        "lastChecked": "2016-04-22T08:13:56.354Z",
        "unreadEmails": 5
    }

In some rare cases the data provided by the developer will require some
additional formatting before it can be placed into the string. FTL provides
a list of built-in functions that can help with common operations on the
external arguments.

By default, FTL can guess which formatter to run on each kind of argument:
`DATE` or `NUMBER`, but you can also call the builtin explicitly.

Explicit calls are useful because they allow you to pass additional formatting
options that may help make the formatted string look better in the given
language. Examples include: defining month as `short` or `long` in the `DATE`
formatter (using arguments defined in `Intl.DateTimeFormat`) or whether to use
grouping separator when displaying a large number.
