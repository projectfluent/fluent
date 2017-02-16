Working With Text: Multiline, Quote Delimited Strings
-----------------------------------------------------
```
about = About Our Software
description =
    | Loki is a simple micro-blogging
    | app written entirely in <i>HTML5</i>.
    | It uses FTL to implement localization.
more-info = "  Read more about us! "

```

The value of an FTL message is usually a simple string.

By default, a string begins after a `=` and ends with the end of line. You can
also define easy-to-read, multiline strings with a pipe mark-up, as can be seen
in the `description` message.

FTL ignores leading whitespaces in front of the value allowing localizers to
align their messages for readability. For multiline strings, whitespaces both
before and after the pipe are ignored. In rare cases where leading whitespaces
should be part of the value, FTL allows for special quote delimited strings as
can be seen in the `more-info` message.
