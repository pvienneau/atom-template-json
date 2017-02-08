# Atom JSON Generator

Simply maintain your JSON template structure, while Atom generates the dummy data for you.

## Code Example

_See the [Usage Page](https://github.com/pvienneau/atom-json-generator/wiki/Usage)_ for additional information.

Consider the following `.template.json` file:

```
{
    "users": [
        {{repeat(5)}}
        {
            "id": {{id()}},
            "guid": {{guid()}},
            "description": {{string(50)}},
            "birth_year": {{random(1975, 2005)}},
            "date_created": {{timestamp()}}
        }
    ]
}
```

Running <kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>p</kbd> will generate the following JSON file:

```json
{
    "users": [
        {
            "id": 1,
            "guid": 25,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birth_year": 1995,
            "date_created": 1486020722420
        }, {
            "id": 2,
            "guid": 26,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birth_year": 1992,
            "date_created": 1486031839502
        }, {
            "id": 3,
            "guid": 27,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birth_year": 1982,
            "date_created": 1486057309388
        }, {
            "id": 4,
            "guid": 28,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birth_year": 1990,
            "date_created": 1486315645957
        }, {
            "id": 5,
            "guid": 29,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing",
            "birth_year": 1992,
            "date_created": 1486432900202
        }
    ]
}
```

## Share your Feedback!

This is an early release of the package. I am looking for feedback as to what data generation functions would be interesting to have as part of this package. If you have ideas, feel free to open an [issue](https://github.com/pvienneau/atom-json-generator/issues)!
