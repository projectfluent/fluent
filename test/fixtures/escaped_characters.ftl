## Literal text
text-backslash-one = Value with \ a backslash
text-backslash-two = Value with \\ two backslashes
text-backslash-brace = Value with \{placeable}
text-backslash-u = \u{41}
text-backslash-backslash-u = \\u{41}

## String literals
quote-in-string = {"\""}
backslash-in-string = {"\\"}
# ERROR Mismatched quote
mismatched-quote = {"\\""}
# ERROR Unknown escape
unknown-escape = {"\x"}

## Unicode escapes
string-unicode-1digit = {"\u{9}"}
string-unicode-2digits = {"\u{09}"}
string-unicode-3digits = {"\u{009}"}
string-unicode-4digits = {"\u{0009}"}
string-unicode-5digits = {"\u{00009}"}
string-unicode-6digits = {"\u{000009}"}

escape-unicode-4digits = {"\\u{41}"}
escape-unicode-6digits = {"\\u{01F602}"}

# ERROR Too few hex digits.
string-unicode-0digits = {"\u{}"}
# ERROR Too many hex digits.
string-unicode-7digits = {"\U{001F602}"}

# ERROR Missing opening brace.
string-unicode-missing-open = {"\u9}"}
# ERROR Missing closing brace.
string-unicode-missing-close = {"\u{9"}

## Literal braces
brace-open = An opening {"{"} brace.
brace-close = A closing {"}"} brace.
