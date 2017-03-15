# Tags

```
brand-name = Aurora
    #żeński

has-updated = { brand-name ->
        [męski] { brand-name} został zaktualizowany.
        [żeński] { brand-name } została zaktualizowana.
       *[inny] Program { brand-name } został zaktualizowany.
    }
```

Sometimes translations might vary depending on some grammatical trait of
another message.  In the example above the form of the past tense of _has been
updated_ depends on the grammatical gender of `brand-name`.

In such cases you can _tag_ messages with simple one-word _hashtags_ and then
define different translations based on these tags.  You define them with `#`
which must start on a new line under the message, indented.

Hashtags are specific to your language's grammar and don't have to be in
English. In the example above, _żeński_ means _feminine_, _męski_ is
_masculine_ and _inny_ is _other_.

Both tags and variants discussed in the previous chapter can be used to provide
more information about a message that is specific to your language.  There's
a number of differences between them, however.

  - Tags don't have a value; they _are_ the value.

  - Tags can only be used for matching.  They cannot be inserted into another
    translation.

  - Tags describe grammatical traits; they should answer the question _Is this
    message &lt;tagname&gt;_?  For instance, _Is this message feminine?_

  - On the other hand, variants define different _facets_ of the message.  It's
    the same value, just in slightly different forms to make it grammatically
    correct when used inside of other messages.
