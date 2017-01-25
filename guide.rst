===========================
The Guide to the FTL Syntax
===========================

FTL is a localization file format used for describing translation resources.

FTL is designed to be simple to read, but at the same time allows to represent
complex concepts from natural languages like gender, plurals, conjugations,
and others.

The following chapters will demonstrate how to use FTL to solve localization 
challenges. Each chapter contains a hands-on example of simple FTL concepts.


Hello World
===========

In FTL, software refers to messages in a given language through unique
identifiers.

::

    hello = Hello, World!

This is an entity called ``hello``. Entities are containers for information. 
You use entities to identify, store, and recall information to be used in the 
software's UI.

In its simplest form, an entity has just a single string value; here *Hello,
World!*. Most of the entities you will work with in FTL will look similar to 
this. Some will be more complex, have more than one value variant, or use 
expressions to select the right variant depending on the circumstances.


Working With Text: Multiline, Quote Delimited Strings
=====================================================

::

    about        = About Our Software
    description  =
        | Loki is a simple micro-blogging
        | app written entirely in <i>HTML5</i>.
        | It uses FTL to implement localization.
    more-info     =   "  Read more about us! "

The value of an FTL entity is usually a simple string.

By default, a string begins after a ``=`` and ends with the end of line.  You 
can also define easy-to-read, multiline strings with a pipe mark-up, as can be
seen in the ``description`` entity.

FTL ignores leading whitespaces in front of the value allowing localizers to
align their messages for readability.
For multiline strings, whitespaces both before and after the pipe are ignored.
In rare cases where leading whitespaces should be part of the value, FTL allows
for special quote delimited strings as can be seen in
the ``more-info`` entity.


Entity References
=================

::

    brandName = Loki
    installing = Installing { brandName }.

    menu-save = Save
    help-menu-save = Click "{ menu-save }" to save the file.

Strings in FTL may use special syntax to incorporate small pieces of
programmable interface. Those pieces are denoted with curly braces ``{`` and
``}`` and are called placeables.

One example of a placeable is a reference to another entity.

Referencing other entities generally helps to keep certain translations
consistent across the interface and makes maintenance easier.  It is also
particularly handy for keeping branding separated from the rest of the
translations, so that it can be changed easily when needed, e.g. during the
build process of the application.


Interpolation and External Arguments
====================================

::

    welcome = Welcome { $user }
    unreadEmails = { $user } has { $emailCount } unread emails.

::

    {
        "user": "Jane",
        "emailCount": 5
    }


Another common common use case for a placeable is to put an external argument,
provided by the developer, into the string.

There are all kinds of external data that might be useful in providing a good 
localization: user names, number of unread messages, battery level, current 
time, time left before an alarm goes off, etc.

To reference a context data variable, use the dollar syntax in your FTL code: 
``$user``. ``user`` has to be defined in the context data. In the examples 
below, we insert the value of a context data variable into an entity's value.


Builtins
========

::

    emails = You have { $unreadEmails } unread emails.
    emails2 = You have { NUMBER($unreadEmails) } unread emails.

    last-notice =
        | Last checked: { DATETIME($lastChecked, day: "numeric", month: long") }.

::

    {
        "lastChecked": "2016-04-22T08:13:56.354Z",
        "unreadEmails": 5
    }

In some rare cases the data provided by the developer will require some
additional formatting before it can be placed into the string.  FTL provides
a list of built-in functions that can help with common operations on the
external arguments.

By default, FTL can guess which formatter to run on each kind of argument:
``DATE``, ``NUMBER``, ``LIST`` etc., but you can also call the builtin
explicitly.

Explicit calls are useful because they allow you to pass additional formatting
options that may help make the formatted string look better in the given
language. Examples include: defining month as ``short`` or ``long`` in the
``DATE`` formatter (using arguments defined in ``Intl.DateTimeFormat``) or
whether to use grouping separator when displaying a large number.


Selectors
=========

::

    emails = { $unreadEmails ->
        [one] You have one unread email.
       *[other] You have { $unreadEmails } unread emails.
    }

::

    {
        "unreadEmails": 5
    }

One of the most common cases when a localizer needs to use a placeable is when
there are multiple variants of the string that depend on some external
argument.  FTL provides the select expression syntax, which chooses one of the
provided variants based on the given selector.

The selector may be a string in which case it will be compared directly to the
keys of variants defined in the select expression.  For number selectors, the
variant keys either match the number exactly or they match the `CLDR plural
category`_ for the number.  The possible categories are: ``zero``, ``one``,
``two``, ``few``, ``many`` and ``other``.  For instance, English has two plural
categories: ``one`` and ``other``.

.. _CLDR plural category: http://www.unicode.org/cldr/charts/30/supplemental/language_plural_rules.html

If the translation requires a number to be formatted in a particular
non-default manner, the selector should use the same formatting options.  The
formatted number will then be used to choose the correct CLDR plural category
which for some languages might be different than the category of the
unformatted number::

    your-score = { NUMBER($score, minimumFractionDigits: 1) ->
        [0.0]   You scored zero points. What happened?
       *[other] You scored { NUMBER($score, minimumFractionDigits: 1) } points.
    }


Advanced Selectors
==================

::

    available-users = { LEN($users) ->
        [0] No users
        [1] One user.
        [2] Two users.
       *[other] { LEN($users) } users.
    }

    unread-emails = You have { $unreadEmails ->
        [0] no unread emails.
        [one] one unread email.
       *[other] { $unreadEmails } unread emails.
    }

::

    {
        "users": ["John", "Mary"],
        "unreadEmails": 0
    }

Selectors are pretty powerful. A localizer can use any builtin explicitly and 
select a string variant depending on its output. In case of the 
``available-users`` entity, we used the ``LEN`` builtin and select the variant 
of the string depending on its output.

In the ``unread-emails`` example ``0`` is used explicitly as a member key to
specify a special case for when there are no unread emails.

Additionally, the code specifies the default variant to be used if none of the
others match. It's denoted with a ``*`` operator in front of the variant name.


Variants
========

::

    brand-name =
       *[nominative] Aurora
        [genitive] Aurore
        [dative] Aurori
        [accusative] Auroro
        [locative] Aurori
        [instrumental] Auroro

    about-old = O brskalniku { brand-nam }
    about = O { brand-name[locative] }

As we stated at the beginning of this guide, an entity primarely consist 
a string value. But there are cases, in which it makes sense to store multiple 
variants of the value. The ``brand-name`` example, in languages that use noun 
declension, may need to be declined when referred from other entities.

Select expression, introduced in one of the previous chapters, does not provide 
a way to easily refer to a particular variant of the value from another entity.  
Instead, FTL lets you define traits, which are variants of the whole value that 
can be externally referred to using the ``key[trait]`` syntax.

For instance, in many inflected languages (e.g. German, Finnish, Hungarian, all 
Slavic languages), the *about* preposition governs the grammatical case of the 
complement. It might be the accusative (German), ablative (Latin) or locative 
(Slavic languages).  In Slovenian, the ideal string would inflect the noun, 
like so: *O Aurori*.  However, since we want the name of the browser to be 
stored in the ``brand-name`` entity, we can't modify it.

The work-around is to inflect an auxiliary noun complement, e.g. browser, to 
give *About the Aurora browser*. Needless to say, this ends up being long and 
often unnaturally-sounding to the native speakers. See ``about-old`` for the 
example in Slovenian.

This problem can be easily solved by defining multiple variants of the 
``brand-name`` entity, to match different grammatical cases of the noun.


Storing Additional Information
==============================

::

    brand-name = Firefox
        [gender] masculine

    opened-new-window = { brand-name[gender] ->
       *[masculine] { brand-name } otworzyl nowe okno.
        [feminine] { brand-name } otworzyla nowe okno.
    }

Traits are useful beyond just value variants. They can be also used to describe 
parameters of the entity that can be then used in other selectors.

Imagine an entity ``brand-name`` that can be either *Firefox* or *Aurora*.  The 
former is *masculine*, while the latter is *feminine*, so sentences that refer 
to this entity may want to branch depending on the gender of it.


HTML/XUL Attributes
===================

::

    login-input = Predefined value
        [html/placeholder] example@email.com
        [html/aria-label]  Login input value
        [html/title]       Type your login email

Finally, traits can also be very useful when using FTL for localization of more 
complex UI elements, such as HTML components.

Those elements often contain multiple translatable messages per one widget. For 
example, an HTML form input may have a value, but also a ``placeholder`` 
attribute, ``aria-label`` attribute and maybe a ``title`` attribute.

Another example would be a Web Component confirm window with an ``ok`` button, 
``cancel`` button and a message.


Sections
========

::

    instruction = Click "{ open }" to begin
        
    [[menu]]

    open = Open
    close = Close
    edit = Edit
    new-file = New File
    undo = Undo
    search = Search

Grouping entities that belong to a particular piece of UI is possible thanks to 
sections.


Comments
========

::

    # Try to keep all menu entities as single word if possible
    [[menu]]

    open = Open
    close = Close

    # This button lives in a main toolbar
    # $user (String) Currently logged in username
    logout = Logout { $user }

::

    {
        "user": "mkablnik"
    }

Comments in FTL can be either standalone or bound to an entity or section. If 
a comment is located right above section or entity, it belongs to it and 
localization tools will present it in its context.


Complex Example
===============

::

    liked-photo = { LEN($people) ->
        [1]     { $people } likes
        [2]     { $people } like
        [3]     { TAKE(2, $people), "one more person" } like

       *[other] { TAKE(2, $people),
                  "{ LEN(DROP(2, $people)) ->
                      [1]    one more person like
                     *[other]  { LEN(DROP(2, $people)) } more people like
                   }"
                }
    } your photo.

::

    {
        "people": ["Anna", "Jack", "Mary", "Nick"]
    }

Here's a final example. It's a pretty complex and one that you will interact 
with very rarely, but it shows the power of a message that can be localized 
really well thanks to the flexibility of the syntax.

In this example we branch the string depending on the number of people passed 
as an external argument up to three people, and then, if the number is higher, 
we sum up the list and add the variant for one more person, or any number of 
people.

This example is very sophisticated and in fact could be simplified like so::

    liked-photo = { LEN($people) } like your photo

It would work well enough for English and could work for other languages 
without increasing its complexity.

The power of FTL is that you can use the simple variant and then, later, you 
can invest time to improve the message. If the message is very visible to the 
users, it may be worth spending more time to get a better quality of the 
string, if not, you can leave the simple version.

But with FTL, you have a choice.

Dive deeper
===========

You can experiment with the syntax using an interactive editor
at http://l20n.github.io/tinker.
If you are a tool author, you may be interested in the formal `EBNF grammar`_.

.. _EBNF grammar: https://github.com/projectfluent/syntax/blob/master/grammar.ebnf
