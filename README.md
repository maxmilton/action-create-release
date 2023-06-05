[![Build status](https://img.shields.io/github/actions/workflow/status/maxmilton/action-create-release/ci.yml?branch=master)](https://github.com/maxmilton/action-create-release/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/maxmilton/action-create-release)](https://codeclimate.com/github/maxmilton/action-create-release)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/maxmilton/action-create-release)](https://github.com/maxmilton/action-create-release/releases)
[![Licence](https://img.shields.io/github/license/maxmilton/action-create-release.svg)](https://github.com/maxmilton/action-create-release/blob/master/LICENSE)

# action-create-release

GitHub action to create a new GitHub release in your CI workflow.

## Usage

> NOTE: `files` currently only supports `.zip` files. Only valid relative or absolute paths are allowed and globs are not supported.

`.github/workflows/publish.yml`:

```yml
name: publish
on:
  push:
    tags: [v*.*.*]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run test
      - run: cd dist && zip ../chrome-extension.zip *
      - uses: maxmilton/action-create-release@v0
        with:
          files: |
            chrome-extension.zip
          git-tag: ${{ github.ref }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Bugs

Please report any bugs you encounter on the [GitHub issue tracker](https://github.com/maxmilton/action-create-release/issues).

## Changelog

See [releases on GitHub](https://github.com/maxmilton/action-create-release/releases).

## License

MIT license. See [LICENSE](https://github.com/maxmilton/action-create-release/blob/master/LICENSE).

---

© 2023 [Max Milton](https://maxmilton.com)
