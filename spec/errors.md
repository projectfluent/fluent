One of the core principles of Fluent is to provide good basis for excellent error fallback and error reporting.  To this end, the AST parser needs to return all the essential information about errors which can then be used to create helpful error messages and hints.

Below is a description of the data model for the AST errors as implemented in https://github.com/projectfluent/fluent.js/pull/7.

## API

The `fluent-syntax` package would expose the `parse` method which takes a source string and returns an instance of the `Resource` node.

```javascript
import { parse } from 'fluent-syntax';
const resource = parse(source_string);
```

## Resource

The AST node `Resource` is described as follows:

```diff
 export class Resource extends Node {
-    constructor(body = [], comment = null) {
-        super(body, comment);
+    constructor(body = [], comment = null, source = '') {
+        super();
         this.type = 'Resource';
         this.body = body;
         this.comment = comment;
+        this.source = source;
    }
} 
```

## Entries

`Entry` instances now have a `span: { from, to }` field. `from` and `to` are positions relative to the start of the file.

```json
{
    "type": "Message",
    "annotations": [],
    "id": {
        "type": "Identifier",
        "name": "hello-world"
    },
    "value": {
        "type": "Pattern",
        "elements": [
            {
                "type": "StringExpression",
                "value": "Hello, world!"
            }
        ],
        "quoted": false
    },
    "attributes": null,
    "comment": null,
    "span": {
        "from": 44,
        "to": 71
    }
},
```

## Annotations

Parsing errors are now collected into the `annotations` field of `Entry` instances.  In the future, we can add warnings and notes there, too.  We can also consider adding another field, `labels`, which provide more information about the error: the reason why it happened and a suggestion about how to fix it.

```json
{
    "type": "Junk",
    "annotations": [
        {
            "message": "Missing field",
            "name": "ParseError",
            "pos": 85
        }
    ],
    "content": "hello-world Hello, world!\n\n",
    "span": {
        "from": 73,
        "to": 100
    }
},
```

## Positions

`fluent-syntax` exposes two helpers: `lineOffset(source, pos)` and `columnOffset(source, pos)`, both returning 0-based offset numbers.  They may be used to place gutter markers in editors or to calculate the number of context lines to show around an error.

