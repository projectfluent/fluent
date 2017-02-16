Comments
--------
```
// This comment is for the whole file.

// Try to keep all menu messages as single word if possible
[[menu]]

open = Open
close = Close

// This button lives in a main toolbar
// $user (String) Currently logged in username
logout = Logout { $user }
```
```json
{
    "user": "mkablnik"
}
```

In FTL Comments can be standalone or bound to a file, message or section.

If a comment is located right above section or message, it belongs to it and
localization tools will present it in its context.
If a comment is located at the top of the file it will be bound to the whole file.

All other comments are standalone.
