# Comments

Comments in Fluent start with `#`, `##`, or `###`, and can be used to
document messages and to define the outline of the file.

Single-hash comments (`#`) can be standalone or can be bound to messages. If
a comment is located right above a message it is considered part of the
message and localization tools will present the message and the comment
together. Otherwise the comment is standalone (which is useful for commenting
parts of the file out).

Double-hash comments (`##`) are always standalone. They can be used to divide
files into smaller groups of messages related to each other; they are
group-level comments. Think of them as of headers with a description.
Group-level comments are intended as a hint for localizers and tools about
the layout of the localization resource. The grouping ends with the next
group comment or at the end of the file.

Triple-hash comments (`###`) are also always standalone and apply to the
entire file; they are file-level comments. They can be used to provide
information about the purpose or the context of the entire file.

```properties
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

### Localization for Server-side strings of Firefox Screenshots

## Global phrases shared across pages

my-shots = My Shots
home-link = Home
screenshots-description =
    Screenshots made simple. Take, save, and
    share screenshots without leaving Firefox.

## Creating page

# Note: { $title } is a placeholder for the title of the web page
# captured in the screenshot. The default, for pages without titles, is
# creating-page-title-default.
creating-page-title = Creating { $title }
creating-page-title-default = page
creating-page-wait-message = Saving your shot…
```
