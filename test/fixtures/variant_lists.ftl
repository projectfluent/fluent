-variant-list-in-term =
    {
       *[key] Value
    }

# ERROR Attributes of Terms must be Patterns.
-variant-list-in-term-attr = Value
    .attr =
        {
           *[key] Value
        }

# ERROR Message values must be Patterns.
variant-list-in-message =
    {
       *[key] Value
    }

# ERROR Attributes of Messages must be Patterns.
variant-list-in-message-attr = Value
    .attr =
        {
           *[key] Value
        }

-nested-variant-list-in-term =
    {
       *[one] {
          *[two] Value
       }
    }

-nested-select =
    {
       *[one] { 2 ->
          *[two] Value
       }
    }

# ERROR VariantLists may not appear in SelectExpressions
nested-select-then-variant-list =
    {
       *[one] { 2 ->
          *[two] {
             *[three] Value
          }
       }
    }

# ERROR VariantLists are value types and may not appear in Placeables
variant-list-in-placeable =
    A prefix here {
       *[key] Value
    } and a postfix here make this a Pattern.
