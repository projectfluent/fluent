# Interpolation and External Arguments

Strings in FTL may use special syntax to incorporate small pieces of
programmable interface. Those pieces are denoted with curly braces `{` and `}`
and are called placeables.

It's common to use placeables to interpolate external arguments into the
translation. External arguments are provided by the developer and may change
on runtime.

```
welcome = Welcome { $user }
unreadEmails = { $user } has { $emailCount } unread emails.
```
```json
{
    "user": "Jane",
    "emailCount": 5
}
```

There are all kinds of external data that might be useful in providing a good
localization: user names, number of unread messages, battery level, current
time, time left before an alarm goes off, etc.

To reference a variable, use the dollar syntax in your FTL code:
`$user`. `user` has to be defined in the context data. In the examples below,
we insert the value of a context data variable into a message's value.
