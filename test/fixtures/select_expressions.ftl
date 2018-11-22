new-messages =
    { BUILTIN() ->
        [0] Zero
       *[other] {""}Other
    }

valid-selector-term-attribute =
    { -term.case ->
       *[key] value
    }

# ERROR
invalid-selector-term-value =
    { -term ->
       *[key] value
    }

# ERROR
invalid-selector-term-variant =
    { -term[case] ->
       *[key] value
    }

# ERROR
invalid-selector-term-call =
    { -term(case: "nominative") ->
       *[key] value
    }

empty-variant =
    { 1 ->
       *[one] {""}
    }

nested-select =
    { 1 ->
       *[one] { 2 ->
          *[two] Value
       }
    }

# ERROR VariantLists cannot be Variant values.
nested-variant-list =
    { 1 ->
       *[one] {
          *[two] Value
       }
    }

# ERROR Missing line end after variant list
missing-line-end =
    { 1 ->
        *[one] One}
