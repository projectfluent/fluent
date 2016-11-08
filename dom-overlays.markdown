DOM Overlays
============

This document outlines the design for the secure DOM localization method which 
avoids `innerHTML` and allows the use of a subset of safe HTML in translations.

The original design and the implementation came from L20n (see [discussion][] 
and bug [921169][]).  The ongoing work to implement the same approach in 
Firefox OS is tracked by bug [994357][].

[discussion]: https://groups.google.com/forum/#!msg/mozilla.tools.l10n/9JvxgTUwIrk/70ja-BE55kQJ
[921169]: https://bugzil.la/921169
[994357]: https://bugzil.la/994357


Introduction
------------

A common challenge in web content localization is the embedding of HTML markup 
in the original source content and in translations.  The common scenarios 
include:

  - a link in the source copy whose text description needs to be translated,
  - an interactive UI element (e.g. a button) which needs to be positioned 
    inside of the localizable copy according to grammar rules,
  - a semantic element in the translation (including the en-US copy), such as 
    a `strong`, `em`, `sup` or `bdi` element,
  - an HTML entity which might be easier to type (and then manage) for the 
    localizer than the actual character, e.g. `&nbsp;`.

The current approach used by the l10n.js library is to default to changing 
element's `textContent` which renders all of the above scenarios impossible.  
A workaround is to explicitly order l10n.js to change the `innerHTML` 
attribute, which needs to be done by the developer.  This has two negative 
consequences:

  - `innerHTML` is inherently insecure which will start to matter once we 
    implement user-installable language packages,
  - the decision to specify `innerHTML` is in the developers' hands which means 
    that localizers cannot use any semantic elements nor HTML entities if the 
    source language doesn't use them.

DOM overlays solve these problems by using inert `DocumentFragments` to create 
and then sanitize the DOM in translations.  They also reuse elements and 
attributes found in the source HTML in order to preserve the identity of 
structural DOM elements (e.g. a `button` with a click handler bound to it) and 
to reduce the amount of non-localizable content that is present in translations 
(e.g `style` attributes will be copied from the source HTML and need not be 
defined in the translation at all).


Goals
-----

  1. Make it possible to localize content in HTML elements and attributes 
     without forcing developers to split strings into pre- and post- parts 
     (definitely a bad practice).  For instance, it should be possible for an
     `<a>` element to be a part of the translation.

  2. Make it possible for localizers to apply text-level semantics to the 
     translations and make use of HTML entities.  For instance, it should be 
     possible for a localizer to use a `sup` element in "M<sup>me</sup>" (an 
     abbreviation of French "Madame") even if the original source string 
     doesn't contain the `sup` element.


Constraints
-----------

  1. Make the whole system secure and don't trust translations by default.  For 
     instance, the localizer should not be able to add an `onclick` handler or 
     overwrite the target of `href` or `src` without the developer or the 
     localization engineer knowingly allowing it.

  2. Don't break the Web;  in particular don't break any two-way bindings the 
     developer or any third-party libraries might have set up on existing DOM 
     nodes.


Text-level semantic elements
----------------------------

DOM Overlays support a safe set of text-level semantical elements and a safe 
set of translatable attributes.  A detailed specification is provided at the 
bottom of this document.  For example if the source HTML looks like this:

    <p data-l10n-id="noTagsHere"></p>

…and the translation is:

    M<sup>me</sup> means Madame.

The result will be:

    <p data-l10n-id="noTagsHere">
      M<sup>me</sup> means Madame.
    </p>

DOM overlays also allow localizers to use HTML entities:

    Translations can now use HTML entities&mdash;like here.


Overlaid elements
-----------------

Additionally, HTML elements can be explicitly allowed in translations by the 
developer by defining them as children of the element on which a `data-l10n-id` 
attribute was set.  Structural (non-localizable) attributes defined on these 
children will be applied to the translation's DOM.  This improves the 
separation of content and structure and reduces the cruft in localization 
files. 

Consider the following paragraph taken from 
[www.mozilla.org](http://www.mozilla.org).

> Portions of this content are ©1998–2012 by individual mozilla.org 
> contributors. Content available under a [Creative Commons 
> license](/foundation/licensing/website-content.html). 

The HTML code for this paragraph is this:

    <p>
        Portions of this content are ©1998–2012 by individual 
        mozilla.org contributors. Content available under a <a 
        href="/foundation/licensing/website-content.html">Creative 
        Commons license</a>.
    </p>

Take note of the `a` tag with an `href` attribute.  The `href` is a URL, and it 
makes this HTML significantly harder to read.  Furthermore, the URL will always 
be `/foundation/licensing/website-content.html` in this case, regardless of the 
user's locale.  It makes little sense, then, to have it in the source string.  
The tag makes the string harder to read and increases the risk of a localizer 
introducing an error (e.g., by removing a quotation mark or accidentally 
editing the URL).  Most of the localization tools don't check for HTML 
syntax errors either.

In fact, the `href` attribute is part of the document's structure rather than 
its source content, and as such, does not belong in the localization string at 
all.

DOM overlays allow localizers to safely ignore attributes that are not related 
to the source _content_.  The values of those attributes will be taken directly 
from the source HTML.  In addition, thanks to a sanitization step, the 
localizers also get to use a subset of HTML in their translations to create 
better semantical markup.


Sanitization
------------

Translations' DOM fragments are first created inert and sanitized according to 
a whitelist of elements and attributes which are allowed on them.  Only the 
whitelisted attributes found in the translation will be preserved.  For 
instance if the source HTML looks like this:

    <p data-l10n-id="aIsAllowed">
      <a href="http://mozilla.org"
         class="btn-back"
         title="Mozilla"></a>
    </p>

The translation can be:

      Go back to
      <a href="http://myevilwebsite.com" 
         onclick="alert(1)"
         title="Back to the homepage">Mozilla.org</a>

And the result will be:

    <p data-l10n-id="noTagsHere">
      Go back to <a href="http://mozilla.org" 
                    class="btn-back"
                    title="Back to the homepage">Mozilla.org</a>
    </p>

The `title` attribute is on the whitelist and will be overwritten by the 
translation.  The `href` and `onclick` attributes are not on the whitelist 
and cannot be overwritten.

In the future, ITS's `translateRules` can be supported to let developers 
specify which elements and which attributes should be added to the whitelist, 
globally or locally.  See the notes about data attributes below and 
http://www.w3.org/TR/its20/#html5-global-approach.


Another example
---------------

Source HTML:

    <label data-l10n-id="fullName">
      <input name="fn">
    </label>

    <label data-l10n-id="age">
      <input name="age" type="number" min="0">
    </label>

    <input data-l10n-id="submit" type="submit">

Translation:

    fullName     = Full name: <input placeholder="First Last">
    age          = Age: <input> <small>(optional)</small>
    submit.value = Submit

Result:

    <label data-l10n-id="fullName">
      Full name: <input name="fn" placeholder="First Last">
    </label>

    <label data-l10n-id="age">
      Age: <input name="age" type="number" min="0">
      <small>(optional)</small>
    </label>

    <input data-l10n-id="submit" type="submit" value="Submit">


Whitelisted elements
--------------------

The list is based on the section of the HTML5 WD on [text-level semantics][].

[text-level semantics]: http://www.w3.org/html/wg/drafts/html/master/text-level-semantics.html#text-level-semantics

Elements which are always allowed in translations:

    a, em, strong, small, s, cite, q, dfn, abbr, data, time, code, var, 
    samp, kbd, sub, sup, i, b, u, mark, ruby, rt, rp, bdi, bdo, span, 
    br, wbr

Note that it's OK for an `a` element to appear in the translation because 
the `href` attribute is not on the whitelist (see below).


Whitelisted attributes
----------------------

In the following list a question mark `(?)` means that the attribute is 
currently not on the whitelist.

Global attributes:

  - title
  - aria-label
  - aria-valuetext

  Notes:

  - aria-valuetext is interesting because it can have multiple text 
    values depending on the value of the input.  
    http://www.w3.org/TR/wai-aria/states_and_properties#aria-valuetext


Except for global attributes, all other attributes are context-sensitive.  The 
list is based on the list available in the section of the HTML5 WD on the 
["translate" attribute][].

["translate" attribute]: http://www.w3.org/html/wg/drafts/html/master/dom.html#attr-translate

a, area

  - download
  - (?) href
  - (?) hreflang

  Notes:

    `href` and `hreflang` are currently not translatable, but I found an 
    interesting discussion about making them 'localizable'.  This has 
    been slated for the next version of ITS, though.  It looks like it 
    would be best to raise this topic again with Norbert.  See:
    http://www.w3.org/International/track/issues/217

q, blockquote

  - (?) cite

  Notes:

    if the localizer translates a quote by choosing a different, perhaps more 
    culturally relevant quote, the `cite` attribute should be changed 
    correspondingly;  I think this is a rare use-case.  Also see the 
    discussion about 'localizable' attributes mentioned at `a, area`.

input

  - value

menuitem, menu, optgroup, option, track

  - label

area, img, input

  - alt

input, textarea

  - placeholder

th

  - abbr

meta

  - (?) content 
      
  Notes:
  
    `content` attribute should only be translatable if the name attribute 
    specifies a metadata name whose value is known to be translatable;  

iframe

  - (?) srcdoc

  Notes:
  
    `srcdoc` must be parsed and recursively processed, see:
    http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#attr-iframe-srcdoc
