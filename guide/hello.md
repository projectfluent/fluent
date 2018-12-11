# Hello World

In Fluent, the basic unit of translation is called a message.
The simplest example of a message looks like this:

```
hello = Hello, World!
```

Messages are containers for information. You use messages to identify, store,
and recall translation information to be used in the software's UI.

Each message has an identifier that allows the developer to bind it to the place
in the software where it will be used. The above message is called `hello`.

In its simplest form, a message has just a single text value; in the example
above it's *Hello, World!*. The value begins at the first non-blank character
after the `=` sign, but there are rare exceptions related to multiline text
values. The next chapter ([Working with Text](text.html)) has all the
details.

Most of the messages you will work with in Fluent will look similar to
the one above. Fluent has been designed to keep these simple translations
simple. Sometimes, however, messages in Fluent can be more complex, have more
than one value variant, one or more attributes, or use expressions to select
the right variant depending on the circumstances. Read on to learn how to
read, edit and create such messages.
