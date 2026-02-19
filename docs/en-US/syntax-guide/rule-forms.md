# Rule Forms Overview

TypeGuard rules are JSON-expressible structures. The core forms are:

- String rules: `"string"`, `"uint32"`, `"@MyType(1,2)"`, `"==hello"`
- Literal rules: `123`, `true`, `false`, `null`
- Object rules: `{ "name": "string", "age?": "uint8" }`
- Array modifier rules: `["$.array", 3, "string"]`
- Composite rules: `["$.or", "string", "int"]`

