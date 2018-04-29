# Changes Logs

## v0.2.0

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

## v0.1.1

- Fixed filter "|length".
