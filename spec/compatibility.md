# Fluent Syntax Compatibility

The goal of this document is to establish a shared vision for Fluent’s
compatibility strategy after the 1.0 release. The vision will serve two
primary purposes:

  - (External) Manage early-adopters’ expectations of Fluent Syntax and
    tooling.

  - (Internal) Inform the triage during the 1.x lifecycle, 2.0 and beyond.


## Types of Changes

_Backwards incompatible_ changes make old files not parse in the current
parsers. Removing a feature which was previously available and reporting a
`SyntaxError` instead is a backwards incompatible change.

_Extensions_ are changes which introduce syntax which was previously
forbidden. They make current files with the extended syntax not parse in old
parsers. Old files continue to parse correctly in the current parsers.

_Deprecations_ are non-breaking changes meant to encourage the use of more
modern syntax and guarantee a transition period for migrating translations to
the modern syntax. They may herald future removals of syntax features.


## The 1.x

In the 1.x lifetime, no breaking changes are allowed. The syntax and the AST
must maintain backwards compatibility with 1.0.

The dot releases may introduce new syntax in a backwards compatible way. New
features are only allowed as extensions to the 1.0 syntax and the AST.

Extensions may be accompanied by deprecations. Deprecated syntax will
continue to be supported throughout the 1.x lifetime. Parsers will report
deprecations as `Annotations` in the `SyntaxNode.annotations` field.
Authoring tools should encourage translators to use the new syntax. They are
free to choose the length of the grace period by configuring which
deprecations should be considered as errors, depending on the currently-used
Fluent implementation in the target project.


## The 2.0

The 2.0 release is a breaking one. It removes the deprecated features of the
syntax and keeps only the modern ones. Feature-wise, 2.0 is the last 1.x
release with all deprecations removed.

We’re developing Fluent with a future standard in mind. Fluent 2.0 will be a
stepping stone towards it, achieving the following goals.

  - Trimming deprecated features is an opportunity to establish a fresh
    baseline for subsequent Fluent 2.x releases and the future standard.

  - It will improve the learnability of Fluent by reducing the cognitive
    complexity of the syntax.

  - Finally, it will allow implementations to streamline their codebases,
    which can increase their quality and give opportunities for new performance
    optimizations.

To help the users transition to 2.0, we’ll create a tool, `fluent1to2`, for
performing a one-time migration from 1.x to 2.0. This tool would use the last
stable version of the 1.x parser and would force the serialization of the
deprecated syntax using the more modern alternatives, if possible.


## The 2.x and Beyond

The dot releases in the 2.x lifetime will follow the same rules as 1.x. The
3.0 will follow the same rules as 2.0.
