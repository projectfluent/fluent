# Message References

```
brandName = Loki
installing = Installing { brandName }.

menu-save = Save
help-menu-save = Click "{ menu-save }" to save the file.
```

Strings in FTL may use special syntax to incorporate small pieces of
programmable interface. Those pieces are denoted with curly braces `{` and `}`
and are called placeables.

One example of a placeable is a reference to another message.

Referencing other messages generally helps to keep certain translations
consistent across the interface and makes maintenance easier. It is also
particularly handy for keeping branding separated from the rest of the
translations, so that it can be changed easily when needed, e.g. during the
build process of the application.
