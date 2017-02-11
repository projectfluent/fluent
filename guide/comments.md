Comments
--------

    # Try to keep all menu entities as single word if possible
    [[menu]]

    open = Open
    close = Close

    # This button lives in a main toolbar
    # $user (String) Currently logged in username
    logout = Logout { $user }

    {
        "user": "mkablnik"
    }

Comments in FTL can be either standalone or bound to an entity or section. If
a comment is located right above section or entity, it belongs to it and
localization tools will present it in its context.
