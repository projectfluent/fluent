# Attributes

```
login-input = Predefined value
    .placeholder = example@email.com
    .aria-label = Login input value
    .title = Type your login email

```

UI elements often contain multiple translatable messages per one widget. For
example, an HTML form input may have a value, but also a `placeholder`
attribute, `aria-label` attribute, and maybe a `title` attribute.

Another example would be a Web Component confirm window with an `OK` button,
`Cancel` button, and a message.

In order to prevent having to define multiple separate messages for representing
different strings within a single element, FTL allows you to add attributes to
messages.

This feature is particularly useful in translating more complex widgets since,
thanks to all attributes being stored on a single unit, it's easier for editors,
comments, and tools to identify and work with the given message.

Attributes may also be used to define grammatical properties of
[terms](terms.html). Attributes of terms are private and cannot be retrieved
by the localization runtime. They can only be used as
[selectors](selectors.html).
