# Hello, world!

In Fluent, the basic unit of translation is called a message. Messages are
containers for information. You use messages to identify, store, and recall
translation information to be used in the product. The simplest example of a
message looks like this:

```
hello = Hello, world!
```

Each message has an identifier that allows the developer to bind it to the place
in the software where it will be used. The above message is called `hello`.

In its simplest form, a message has just a single text value. In the example
above the value is *Hello, world!*. The value begins at the first non-blank
character after the `=` sign, but there are rare exceptions related to
multiline text values. The next chapter ([Writing Text](text.html)) has all
the details.

The majority of messages in Fluent will look similar to the one above. Fluent
has been designed to keep these simple translations simple. Sometimes,
however, messages need more complexity. Throughout this guide, you'll learn
how to adjust messages to the grammar of your language and the requirements
of the localized product.

Read on to learn how to read and write Fluent!
