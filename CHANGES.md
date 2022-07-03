# Changes Logs

## v1.3.0

- fix(project): replaced substr with slice.

## v1.2.0

- Added API `IInlineCompiler.addPredefinedType`.
- Deprecated type `TypeChecker` with new type `ITypeChecker`.

## v1.1.0

- Allows characters `.:-` in predefined type names.
- Removed the distribution of AMD/SystemJS modules.
- Improved the output of `$.or` and `$.and`.

## v1.0.1

- Fixed lack of positive expression when `any` or `true` is used.

## v1.0.0

- A full refactor, with a better and simple code generation.

- New modifier `$.type` for pre-defined type supports.

    > e.g.
    >
    > ```json
    > {
    >   "a": ["$.type", "test", "string"],
    >   "b": "@test",
    >   "c": "@test"
    > }
    > ```
    >
    > Register a pre-defined type `test`, and refers it by `@test`.

- New modifier `$.string` for value in string form.

- Improved tuple, add omittable dots `...` supports.

    > e.g. `["$.tuple", "string", "...3", "int", "..."]`

- Replace `$.array` with `$.list`.

- Renamed modifier `$.struct` to `$.strict`.

- New modifier `$.equal` for recursive edition of `$.strict`.

- Now `$.array` is used for length-fixed or length-variable array.

    > e.g.
    > - `["$.array", 3, "string"]` means 3 elements
    > - `["$.array", [3], "string"]` means at least 3 elements
    > - `["$.array", [3, 5], "string"]` means 3 ~ 5 elements

- Added range arguments for built-in types.

    > e.g.
    > - `string(1, 5)` means length 1 ~ 5
    > - `int(, -10)` means not larget than `-10`

- Added length arguments for array types.

    > e.g.
    > - `string[1, 5]` means 1 ~ 5 elements
    > - `string[1,]` means at least 1 element

- Added built-in types:

    - `safe_int`
    - `safe_uint`
    - `ufloat`
    - `decimal`
    - `udecimal`
    - `struct`
    - `hex_string`
    - `required`

- Removed built-in types:

    - `object`
    - `valid_object`

- Improved the string assert expressions with following features:

    - equal
    - not-equal
    - equal (case-insensitive)
    - not-equal (case-insensitive)
    - include
    - not-include
    - include (case-insensitive)
    - not-include (case-insensitive)
    - start-with
    - not-start-with
    - start-with (case-insensitive)
    - not-start-with (case-insensitive)
    - end-with
    - not-end-with
    - end-with (case-insensitive)
    - not-end-with (case-insensitive)
    - match (RegExp)
    - not-match (RegExp)

## v0.3.1

- Fixed the `undefined` detection.

## v0.3.0

-   Upgrade TypeScript compiler to `v2.9.2`.
-   Allowed built-in type in filter:

    To ensure an unsigned integer less than 1000, the rule should be

    ```json
    ["$.and", "uint", "|value lt 1000"]
    ```

    And now, use following rule instead:

    ```json
    "|uint lt 1000"
    ```

## v0.2.0

-   Added advanced type `$.struct` to exactly limit keys of object:

    ```json
    ["$.struct", {
        "a": "int",
        "b": "string"
    }]
    ```

    will not match

    ```json
    {
        "a": 123,
        "b": "aaa",
        "c": "ddd"
    }
    ```

    because only keys `"a"` and `"b"` are defined in description.

    Like `$.map` and `$.array`, there is a easier notation for it in an object
    description:

    ```json
    {
        "a->(=)": {
            "b": "string"
        }
    }
    ```

    equals to

    ```json
    {
        "a": ["$.struct", {
            "b": "string"
        }]
    }
    ```

-   Added reference field name by syntax `$.valueof:field`, e.g.

    ```json
    {
        "method": ["=email", "=password"],
        "$.valueof:method": "string"
    }
    ```

    will `$.valueof:method` means using value of field `method` as the name of 
    a field. Thus it matches

    ```json
    {
        "method": "email",
        "email": "aaa@sample.com"
    }
    ```

    and

    ```json
    {
        "method": "password",
        "password": "xxxxxxxxx"
    }
    ```

-   Added advanced type `$.dict` to limit keys of `$.map`:

    ```json
    ["$.dict", ["a", "b"], "string"]
    ```

    is similar to 

    ```json
    ["$.map", "string"]
    ```

    but only `"a"` and `"b"` is allowed for key of map.

-   Added `undefined` to built-in-types, as alias of `void` and `optional`.

-   Added easier optional type expression with a prepending question mark:

    ```json
    "?string"
    ```

-   Added easier optional field expression with an appending question mark:

    ```json
    {
        "a?": "string",
        "b": "int",
        "map->{}?": "string"
    }
    ```

    This description equals to:

    ```json
    {
        "a": ["string", "void"],
        "b": "int",
        "map": ["$.map", "string"]
    }
    ```

-   Added `ascii_string` and `latin_string`.

-   Removed `ascii_char` and `latin_char`.

-   Removed the limitation of ONE ARGUMENT for `$.array` and `$.map`, so that

    ```json
    ["$.array", "string", "uint32"]
    ```

    is allowed and it works as following code before:

    ```json
    ["$.array", ["string", "uint32"]]
    ```

    > Also works for the new `$.dict`

## v0.1.1

- Fixed filter "|length".
