# phasmophobia_collaborative_journal

[![CI](https://github.com/Celeo/phasmophobia_collaborative_journal/workflows/CI/badge.svg?branch=master)](https://github.com/celeo/phasmophobia_collaborative_journal/actions?query=workflow%3ACI)

TODO

## Installing

TODO

## Using

1. Clone the repo and install dependencies (see below)
1. Run with `poetry run uvicorn main:app --reload` (see [justfile](justfile))

**_Rooms are in-dev_**

## Developing

### Building

### Requirements

- Git
- Python 3.9
- [Poetry](https://python-poetry.org/)
- Redis running on the server (or some other URL via the `REDIS_URL` environment variable)

### Steps

```sh
git clone https://github.com/Celeo/phasmophobia_collaborative_journal
cd phasmophobia_collaborative_journal
poetry install
```

## License

- [MIT](LICENSE)

## Contributing

Please feel free to contribute. Please open an issue first (or comment on an existing one) so that I know that you want to add/change something.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
