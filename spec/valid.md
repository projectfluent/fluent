# Valid Fluent Syntax

Fluent Syntax distinguishes between well-formed and valid resources.

  - Well-formed Fluent resources conform to the Fluent grammar described by the
    Fluent EBNF (`spec/fluent.ebnf`).

  - Valid Fluent resources are additionally checked for semantic correctness.
    The validation process may reject syntax which is well-formed.

This document describes the semantic rules which check validity of well-formed
Fluent resources. The rules are defined using a CSS-like selector syntax.

## Patterns

Well-formed Patterns:

    Message.value > Pattern
    Term.value > Pattern
    Attribute.value > Pattern
    Variant.value > Pattern

## VariantLists

Well-formed VariantLists:

    Message.value > VariantList
    Term.value > VariantList
    Attribute.value > VariantList
    Variant.value > VariantList

Invalid VariantLists:

    Message.value VariantList
    SelectExpression.variants > Variant.value > VariantList

## Placeables

Well-formed Placeables:

    Placeable.expression > Expression

Invalid Placeables:

    Placeable.expression > AttributeExpression.ref > TermReference

## Select Expressions

Well-formed Select Expressions:

    SelectExpression.selector > Expression:not(SelectExpression)

Invalid Select Expressions:

    SelectExpression.selector > MessageReference
    SelectExpression.selector > TermReference
    SelectExpression.selector > CallExpression.callee > TermReference
    SelectExpression.selector > VariantExpression
    SelectExpression.selector > AttributeExpression.ref > MessageReference
