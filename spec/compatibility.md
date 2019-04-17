# Fluent Syntax Compatibility

The goal of this document is to establish a shared vision for Fluent’s
compatibility strategy after the 1.0 release. The vision will serve two
primary purposes:

  - (External) Manage early-adopters’ expectations of Fluent Syntax and
    tooling.

  - (Internal) Contextualize feedback and inform design decisions during the
    1.x lifecycle and beyond.


## Types of Changes

_Backwards incompatible_ changes make old files not parse in the current
parsers. Removing a feature which was previously available and reporting
a `SyntaxError` instead is a backwards incompatible change.

_Extensions_ are changes which introduce syntax which was previously forbidden.
Extensions make current files with the extended syntax not parse in old
parsers. Old files continue to parse correctly in the current parsers.

_Deprecations_ are non-breaking changes meant to encourage the use of more
modern syntax and guarantee a transition period for migrating translations to
the modern syntax. Deprecations herald future removals of syntax features.


## The 1.x

In the 1.x lifetime, there won't be any breaking changes to Fluent Syntax.
The grammar and the AST must maintain backwards compatibility with 1.0.

The dot releases may introduce new syntax in a backwards compatible way. New
features are only allowed as extensions to the 1.0 syntax and the AST.

Extensions may be accompanied by deprecations. Deprecated syntax will continue
to be supported throughout the 1.x lifetime. Parsers will report deprecations
as annotations in the AST.

Authoring tools should provide per-project settings for specifying the lower
and upper bounds of accepted syntax versions, depending on the currently-used
Fluent implementation in the target project. Syntax newer than the upper bound
must not be allowed in the project's translations; syntax deprecated in
versions older than the lower bound should be reported as warnings, and later
on, as errors—depending on the grace period chosen for the project.


## The 2.0

In order to clean up the accrued deprecations, a 2.0 version may be published
in the future, breaking the backward compatibility with 1.x. The 2.0 version
will define the compatibility strategy for Fluent 2.x and beyond.

Removing deprecations will achieve the following goals.

  - Establish a fresh baseline for subsequent Fluent 2.x releases and the
    future standard.

  - Improve the learnability of Fluent by reducing the cognitive complexity of
    the syntax.

  - Allow implementations to streamline their codebases, which can increase
    their quality and give opportunities for new performance optimizations.

If Fluent succeeds as a future standard, the compatibility strategy will be
redefined by the standards organization publishing it.
