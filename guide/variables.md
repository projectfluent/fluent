# Variables

Variables are pieces of data received from the app. They are provided by the
developer of the app and may be interpolated into the translation with
[placeables](placeables.html). Variables can dynamically change as the user
is using the localized product.

Variables are referred to via the `$variable-name` syntax:

```
welcome = Welcome, { $user }!
unread-emails = { $user } has { $email-count } unread emails.
```

For instance, if the current user's name is _Jane_ and she has 5 unread
emails, the above translations will be displayed as:

```
Welcome, Jane!
Jane has 5 unread emails.
```

There are all kinds of external data that might be useful in providing a good
localization: user names, number of unread messages, battery level, current
time, time left before an alarm goes off, etc. Fluent offers a number of
features designed to make working with variables convenient.

## Variants and Selectors

In some languages, using a number in the middle of a translated sentence will
require proper plural forms of words associated with the number. In Fluent,
you can define multiple [variants](selectors.html) of the translation, each
for a different plural category.

## Implicit Formatting

Numbers and dates are automatically formatted according to your language's
formatting rules. Consider the following translation:

```
# $duration (Number) - The duration in seconds.
time-elapsed = Time elapsed: { $duration }s.
```

For the `$duration` variable value of `12345.678`, the following message will be
displayed in the product, assuming the language is set to British or American
English. Note the use of comma as the thousands separator.

```
Time elapsed: 12,345.678s.
```

In South Africian English, however, the result would be:

```
Time elapsed: 12 345,678s.
```

## Explicit Formatting

In some cases the localizer might want to have a greater control over how a
number or a date is formatted in text. Fluent provides [built-in
functions](builtins.html) for this purpose.

```
# $duration (Number) - The duration in seconds.
time-elapsed = Time elapsed: { NUMBER($duration, maximumFractionDigits: 0) }s.
```

For the same value of `$duration` as above, the result will look like the
following for American and British English:

```
Time elapsed: 12,345s.
```
