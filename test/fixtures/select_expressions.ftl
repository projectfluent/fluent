new-messages =
    { BUILTIN() ->
        [0] Zero
       *[other] {""}Other
    }

valid-selector =
    { -term.case ->
       *[    many     words    ] value
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
