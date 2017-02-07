# Atom JSON Generator

Simply manage your JSON template structure, while Atom generates the JSON data for you.

## Code Example:

```
{
    "users": [
        {{repeat(5)}}
        {
            "id": {{id()}},
            "guid": {{guid()}},
            "description": {{string(50)}},
            "birthyear": {{rand(1975, 2005)}},
            "date_created": {{rand_datetime()}}
        }
    ]
}
```

This will result in the following JSON:

```json
{
    "users": [
        {
            "id": 1,
            "guid": 25,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birthyear": 1995,
            "date_created": 1486020722420
        }, {
            "id": 2,
            "guid": 26,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birthyear": 1992,
            "date_created": 1486031839502
        }, {
            "id": 3,
            "guid": 27,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birthyear": 1982,
            "date_created": 1486057309388
        }, {
            "id": 4,
            "guid": 28,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birthyear": 1990,
            "date_created": 1486315645957
        }, {
            "id": 5,
            "guid": 29,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birthyear": 1992,
            "date_created": 1486432900202
        }
    ]
}
```
