## Member expressions in placeables.

message-attribute-expression-placeable = {msg.attr}
term-variant-expression-placeable = {-term[case]}

# ERROR Message values cannot be VariantLists
message-variant-expression-placeable = {msg[case]}
# ERROR Term attributes may not be used for interpolation.
term-attribute-expression-placeable = {-term.attr}

## Member expressions in selectors.

term-attribute-expression-selector = {-term.attr ->
   *[key] Value
}

# ERROR Message attributes may not be used as selector.
message-attribute-expression-selector = {msg.attr ->
   *[key] Value
}
# ERROR Term values may not be used as selector.
term-variant-expression-selector = {-term[case] ->
   *[key] Value
}
# ERROR Message values cannot be VariantLists
message-variant-expression-selector = {msg[case] ->
   *[key] Value
}
