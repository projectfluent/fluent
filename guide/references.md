# Message References

Another use-case for placeables is referencing one message in another one.

```
menu-save = Save
help-menu-save = Click "{ menu-save }" to save the file.
```

Referencing other messages generally helps to keep certain translations
consistent across the interface and makes maintenance easier.

It is also particularly handy for keeping branding separated from the rest of
the translations, so that it can be changed easily when needed, e.g. during
the build process of the application. This use-case is best served by
defining a [term](terms.html) with a leading dash `-`, like `-brand-name` in
the example below.

```
-brand-name = Firefox
installing = Installing { -brand-name }.
```

Using a term here indicates to tools and to the localization runtime that
`-brand-name` is not supposed to be used directly in the product but rather
should be referenced in other messages.
