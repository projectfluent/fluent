# Functions in FTL

Functions provide additional functionality available to the localizers. They
can be either used to format data according to the current language's rules or
can provide additional data that the localizer may use (like, the platform, or
time of the day) to fine tune the translation.

FTL implementations should ship with a number of built-in functions that can be
used from within localization messages.

The list of available functions is extensible and environments may want to
introduce additional functions, designed to aid localizers writing translations
targeted for such environments.

## Using Functions

FTL Functions can only be called inside of placeables. Use them to return
a value to be interpolated in the message or as selectors in select
expressions.

Example:
```
today-is = Today is { DATETIME($date) }
```

## Function parameters

Functions may accept positional and named arguments. Some named arguments
are only available to developers when they pre-format variables passed as
arguments to translations (see [Partially-formatted
variables](#partially-formatted-variables) below).

## Built-in Functions

Built-in functions are very generic and should be applicable to any translation
environment.

### `NUMBER`

Formats a number to a string in a given locale.

Example:
```
dpi-ratio = Your DPI ratio is { NUMBER($ratio, minimumFractionDigits: 2) }
```

Parameters:
```
currencyDisplay
useGrouping
minimumIntegerDigits
minimumFractionDigits
maximumFractionDigits
minimumSignificantDigits
maximumSignificantDigits
```

Developer parameters:
```
style
currency
```

See the
[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
for the description of the parameters.

### `DATETIME`

Formats a date to a string in a given locale.

Example:
```
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

Parameters:
```
hour12
weekday
era
year
month
day
hour
minute
second
timeZoneName
```

Developer parameters:
```
timeZone
```

See the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for the description of the parameters.

## Implicit use

In order to simplify most common scenarios, FTL will run some default functions
while resolving placeables.

### `NUMBER`

If the variable passed from the developer is a number and is used in
a placeable, FTL will implicitly call a NUMBER function on it.

Example:
```
emails = Number of unread emails { $unreadEmails }

emails2 = Number of unread emails { NUMBER($unreadEmails) }
```

Numbers used as selectors in select expressions will match the number exactly
or they will match the current language's [CLDR plural
category](http://www.unicode.org/cldr/charts/30/supplemental/language_plural_rules.html)
for the number.

The following examples are equivalent and will both work. The second example
may be used to pass additional formatting options to the `NUMBER` formatter for
the purpose of choosing the correct plural category:

```
liked-count = { $num ->
        [0]     No likes yet.
        [one]   One person liked your message
       *[other] { $num } people liked your message
    }

liked-count2 = { NUMBER($num) ->
        [0]     No likes yet.
        [one]   One person liked your message
       *[other] { $num } people liked your message
    }
```

### `DATETIME`

If the variable passed from the developer is a date and is used in a placeable,
FTL will implicitly call a `DATETIME` function on it.

Example:
```
log-time = Entry time: { $date }

log-time2 = Entry time: { DATETIME($date) }
```

## Partially-formatted variables

In most cases localizers don't need to call Functions explicitly, thanks to the
implicit formatting. If the implicit formatting is not sufficient, the Function
can be called explicitly with additional parameters.  To ease the burden this
might have on localizers, Fluent implementations may allow developers to set
the default formatting parameters for the variables they pass.

In other words, developers can provide variables which are already wrapped in
a partial Function call.

```
today = Today is { $day }
```

```javascript
ctx.format('today', {
  day: new FluentDateTime(new Date(), {
    weekday: 'long'
  })
})
```

If the localizer wishes to modify the parameters, for example because the
string doesn't fit in the UI, they can pass the variable to the same
Function and overload the parameters set by the developer.

```
today = Today is { DATETIME($day, weekday: "short") }
```
