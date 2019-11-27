# Valid Fluent Syntax

Fluent Syntax distinguishes between well-formed and valid resources.

  - Well-formed Fluent resources conform to the Fluent grammar described by
  the Fluent EBNF (`spec/fluent.ebnf`). The EBNF is auto-generated from
  `syntax/grammar.js`.

  - Valid Fluent resources must be well-formed and are additionally checked
  for semantic correctness. The validation process may reject syntax which is
  well-formed. The validation rules are expressed in code in
  `syntax/abstract.js`.

For example, the `message.attr(param: "value")` syntax is _well-formed_.
`message.attr` is an `AttributeExpression` which may be the callee of a
`CallExpression`. However, this syntax is not _valid_. Message attributes,
just like message values, cannot be parameterized the way terms can.

The distinction between well-formed and valid syntax allows us to keep
Fluent's EBNF simple. More complex rules are enforced in the validation step.
Some implementations might choose to support well-formed Fluent resources and
skip some validation for performance or other reasons. If they do so, it's
recommended that the affected Fluent resources be validated outside of these
implementations, for instance as part of a build-time or compile-time step.
