Hello World
-----------

In Fluent, the basic unit of translation is called a message.
The simplest example of a message looks like this:

```
hello = Hello, World!
```

Messages are containers for information. You use messages to identify, store,
and recall translation information to be used in the software's UI.

Each message has an identifier that allows the developer to bind it to the place
in the software where it will be used. The above message is called `hello`. 

In its simplest form, a message has just a single string value; here *Hello,
World!*. Most of the messages you will work with in Fluent will look similar to
this. Some will be more complex, have more than one value variant, or use
expressions to select the right variant depending on the circumstances.
