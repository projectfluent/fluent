# Recommendations for Writing Fluent

## Unicode Characters

Fluent resources can be written using all Unicode characters. The recommended
encoding for Fluent files is UTF-8.

Translation authors and developers are encouraged to avoid characters defined
in the following code point ranges. They are either control characters or
permanently undefined Unicode characters:

    [U+0000-U+0008], [U+000B-U+000C], [U+000E-U+001F], [U+007F-U+009F],
    [U+FDD0-U+FDEF], [U+1FFFE-U+1FFFF], [U+2FFFE-U+2FFFF], [U+3FFFE-U+3FFFF],
    [U+4FFFE-U+4FFFF], [U+5FFFE-U+5FFFF], [U+6FFFE-U+6FFFF], [U+7FFFE-U+7FFFF],
    [U+8FFFE-U+8FFFF], [U+9FFFE-U+9FFFF], [U+AFFFE-U+AFFFF], [U+BFFFE-U+BFFFF],
    [U+CFFFE-U+CFFFF], [U+DFFFE-U+DFFFF], [U+EFFFE-U+EFFFF], [U+FFFFE-U+FFFFF],
    [U+10FFFE-U+10FFFF].
