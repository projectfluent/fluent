================
Functions in FTL
================

Functions provide additional functionality available to the localizers.
They can be either used to format data according to the current language's
rules or can provide additional data that the localizer may use (like, the
platform, or time of the day) to fine tune the translation.

FTL implementations should ship with a number of built-in functions that can be
used from within localization messages.

The list of available functions is extensible and environments may want to
add additional functions designated to aid localizers writing translations
targeted for a given environment.


How to use Functions
====================

FTL Functions can only be called inside of placeables. Use them to return a
value to be interpolated in the message or as selectors in select expressions.

Example::


  today-is = Today is { DATETIME($date) }


Function parameters
===================

Functions may (but don't have to) accept positional and keyword arguments.
Some keyword parameters are only available to developers and cannot be used
inside of FTL translations. Instead they can be set on external arguments
passed into translations by the developer.
See the reference below for more information about the arguments accepted for
each built-in function.


Built-in Functions
==================

Built-in functions are very generic and should be applicable to any translation
environment.

``NUMBER``
    Formats a number to a string in a given locale.

    Example::

      dpi-ratio = Your DPI ratio is { NUMBER($ratio, minimumFractionDigits: 2) }

    Parameters::

      ''currencyDisplay''
      ''useGrouping''
      ''minimumIntegerDigits''
      ''minimumFractionDigits''
      ''maximumFractionDigits''
      ''minimumSignificantDigits''
      ''maximumSignificantDigits''

    Developer parameters::

      ''style''
      ''currency''

    See the `Intl.NumberFormat`_ for the description of the parameters.


``DATETIME``
    Formats a date to a string in a given locale.

    Example::

      today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }

    Parameters::

      ''hour12''
      ''weekday''
      ''era''
      ''year''
      ''month''
      ''day''
      ''hour''
      ''minute''
      ''second''
      ''timeZoneName''

    Developer parameters::

      ''timeZone''

    See the `Intl.DateTimeFormat`_ for the description of the parameters.

``LIST``
    Formats a list to a string in a given locale.

    Example::

      users = { LIST($user1, $user2, $user3) }

      users2 = { LIST($users) }

    Parameters::

      ''style''

    Developer parameters::

      ''type''

    See the `Intl.ListFormat`_ for the description of the parameters.

``LEN``
    Returns the number that represents the length of the list argument.
    Similar to JS `Array.length`_ API.

    Example::

      unread-emails = Number of unread emails: { LEN($emails) }

``TAKE``
    Returns a slice of a list starting from the first element.
    Similar to JS `Array.prototype.slice`_ API.

    Function accepts a single positional parameter which must be a number which
    defines the number of elements that will be returned from the array.

    Example::

      first-user = Primarely, { TAKE($users, 1) } likes your message.



``DROP``
    Returns a slice of the list starting from a given index.
    Similar to JS `Array.prototype.slice`_ API.

    Function accepts a single positional parameter which must be a number which
    defines the parameter from which the returned slice begins.

    Example::

      more-users = But ultimately, { DROP($users, 1) } like your message as well.


Implicit use
============

In order to simplify most common scenarios, FTL will run some default
functions while resolving placeables.

``NUMBER``
    If the variable passed from the developer is a number and is used in
    a placeable, FTL will implicitly call a `NUMBER` function on it.

    Example::

      emails = Number of unread emails { $unreadEmails }

      emails2 = Number of unread emails { NUMBER($undeadEmails) }

    Numbers used as selectors in select expressions will match the number
    exactly of they will match the current language's `CLDR plural category`_
    for the number.

    The following examples are equivalent and will both work.  The second
    example may be used to pass additional formatting options to the ``NUMBER``
    formatter for the purpose of choosing the correct plural category::

      liked-count = { $num ->
        [0]     No likes yet.
        [one]   One person liked your message
       *[other] { $num } people liked your message
      }

      liked-count2 = { NUMBER($num) ->
        [0]     No likes yet.
        [one]   One person liked your message
       *[other] { $num } people liked your message
      }


``DATETIME``
    If the variable passed from the developer is a date and is used in
    a placeable, FTL will implicitly call a `DATE` function on it.

    Example::

      log-time = Entry time: { $date }

      log-time2 = Entry time: { DATETIME($date) }

``LIST``
    If the variable passed from the developer is an array and is used in
    a placeable, FTL will implicitly call a `LIST` function on it.

    Example::

      users = { LIST($users) }

      users2 = { $users }


Functions as arguments
============================

In most cases users will not have to call out Function explicitly, thanks
to the implicit calls.

The cases where implicit doesn't work will often come when the Function
has to be called with additional parameters, but even then, majority
of scenarios will require the parameters to be set by the developer and only
in rare cases localizer will have to touch them.

Developers can provide the variable already wrapped in Function as an
argument.

Example::

  main.js:

  let date = new Date();
  let s = ctx.format('key1', {
    day: Intl.MessageDateTimeArgument(date, {
      weekday: 'long'
    })
  })

  main.ftl:

  key1 = Today is { $day }

If the localizer decide that they have to modify the parameters, for example
because the string doesn't fit in the UI, they can pass the variable
to the same Function and overload parameters. Example::

  main.ftl:

  key1 = Today is { DATETIME($day, weekday: "short") }


.. _Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
.. _Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
.. _Intl.ListFormat: https://rawgit.com/zbraniecki/proposal-intl-list-format/master/index.html
.. _array.length: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
.. _Array.prototype.slice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
.. _CLDR plural category: http://www.unicode.org/cldr/charts/30/supplemental/language_plural_rules.html
