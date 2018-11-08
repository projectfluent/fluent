## Callees

function-callee = {FUNCTION()}
term-callee = {-term()}

# ERROR Equivalent to a MessageReference callee.
mixed-case-callee = {Function()}

# ERROR MessageReference is not a valid callee.
message-callee = {message()}
# ERROR VariableReference is not a valid callee.
variable-callee = {$variable()}

## Arguments

positional-args = {FUN(1, "a", msg)}
named-args = {FUN(x: 1, y: "Y")}
dense-named-args = {FUN(x:1, y:"Y")}
mixed-args = {FUN(1, "a", msg, x: 1, y: "Y")}

# ERROR Positional arg must not follow keyword args
shuffled-args = {FUN(1, x: 1, "a", y: "Y", msg)}

# ERROR Named arguments must be unique
duplicate-named-args = {FUN(x: 1, x: "X")}


## Whitespace around arguments

sparse-inline-call = {FUN(  "a"  , msg,   x: 1   )}
empty-inline-call = {FUN(  )}
multiline-call = {FUN(
        "a",
        msg,
        x: 1
    )}
sparse-multiline-call = {FUN(

        "a"    ,
        msg
        , x: 1
    )}
empty-multiline-call = {FUN(

    )}


unindented-arg-number = {FUN(
1)}

unindented-arg-string = {FUN(
"a")}

unindented-arg-msg-ref = {FUN(
msg)}

unindented-arg-term-ref = {FUN(
-msg)}

unindented-arg-var-ref = {FUN(
$var)}

unindented-arg-call = {FUN(
OTHER())}

unindented-named-arg = {FUN(
x:1)}

unindented-closing-paren = {FUN(
    x
)}



## Optional trailing comma

one-argument = {FUN(1,)}
many-arguments = {FUN(1, 2, 3,)}
inline-sparse-args = {FUN(  1,  2,  3,  )}
mulitline-args = {FUN(
        1,
        2,
    )}
mulitline-sparse-args = {FUN(

        1
        ,
        2   
        ,
    )}


## Syntax errors for trailing comma

one-argument = {FUN(1,,)}
missing-arg = {FUN(,)}
missing-sparse-arg = {FUN(   ,   )}


## Whitespace in named arguments

sparse-named-arg = {FUN(
        x   :   1,
        y   :   2,
        z
        :
        3
    )}


unindented-colon = {FUN(
        x
:1)}

unindented-value = {FUN(
        x:
1)}
