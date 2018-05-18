# Fluent Specification Support Code

This directory contains support code for the parser-combinator underlying the syntax code, as well as the code to transform `grammar.mjs` to `fluent.ebnf`. The combination allows for a succinct formulation of the syntax in `grammar.mjs` and a readable representation of that in `fluent.ebnf`.

## Parser-Combinator

**`parser.mjs`** is the base parser class, **`stream.mjs`** holds a iterator over the strings to be parsed.

**`combinators.mjs`** hold the actual basic grammar productions and logical combinations of grammar productions.

Both use `Success` and `Failure` from **`result.mjs`** to pass success and failure conditions forward.

After the definition of grammar productions, the utilities in **`mappers.mjs`** are used to concat, flatten, and extract the matched data to prepare it for AST generation.

## EBNF Generation

The `fluent.ebnf` is created by parsing the `grammar.mjs` and transpilation to an EBNF file. The `babylon` JavaScript parser is used to load a Babel AST.

**`ebnf.mjs`** is the top-level entry point used by `bin/ebnf.mjs`. It uses the iteration logic from **`walker.mjs`** to go over the Babel AST and to extract the information relevant to the EBNF via the Visitor in **`visitor.mjs`**. The resulting data is then serialiazed to EBNF via **`serializer.mjs`**.
