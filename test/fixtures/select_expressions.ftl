new-messages =
    { BUILTIN() ->
        [0] Zero
       *[other] {""}Other
    }

valid-selector =
    { -term.case ->
       *[key] value
    }

invalid-selector =
    { -term[case] ->
       *[key] value
    }

variant-list =
    {
       *[key] value
    }

empty-variant =
    { 1 ->
       *[one] {""}
    }


## Variant keys

valid-variant-key-identifier-simple =
    { 1 ->
       *[key] value
    }

valid-variant-key-identifier-padded =
    { 1 ->
       *[    key    ] value
    }

# ERROR
invalid-variant-key-identifier-with-space-inside =
    { 1 ->
       *[many     words] value
    }

# ERROR
invalid-variant-key-identifier-non-latin =
    { 1 ->
       *[ĸəʎ] value
    }

# ERROR
invalid-variant-key-number =
    { 1 ->
       *[15 ducks] value
    }

valid-variant-key-string-with-whitespace =
    { 1 ->
       *["   many     words   "] value
    }

valid-variant-key-string-non-latin =
    { 1 ->
       *["keʎ"] value
    }

valid-variant-key-string-start-with-digits =
    { 1 ->
       *["15 ducks"] value
    }
