# Changes Logs

## v0.2.0

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

-   Added `ascii_string` and `latin_string`.

-   Removed `ascii_char` and `latin_char`.

## v0.1.1

- Fixed filter "|length".
