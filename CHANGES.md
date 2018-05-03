# Changes Logs

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
