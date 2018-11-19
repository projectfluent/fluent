## Reference expressions in placeables.

message-reference-placeable = {msg}
term-reference-placeable = {-term}
variable-reference-placeable = {$var}

# ERROR Function references are invalid outside of call expressions.
function-reference-placeable = {FUN}


## Reference expressions in selectors.

variable-reference-selector = {$var ->
   *[key] Value
}

# ERROR Message values may not be used as selectors.
message-reference-selector = {msg ->
   *[key] Value
}
# ERROR Term values may not be used as selectors.
term-reference-selector = {-term ->
   *[key] Value
}
# ERROR Function references are invalid outside of call expressions.
function-expression-selector = {FUN ->
   *[key] Value
}
