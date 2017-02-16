Interpolation and External Arguments
------------------------------------
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


Another common common use case for a placeable is to put an external argument,
provided by the developer, into the string.

There are all kinds of external data that might be useful in providing a good
localization: user names, number of unread messages, battery level, current
time, time left before an alarm goes off, etc.

To reference a variable, use the dollar syntax in your FTL code:
`$user`. `user` has to be defined in the context data. In the examples below,
we insert the value of a context data variable into a message's value.
