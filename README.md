Deprecation notice: Use the GitHub CLI tool instead. It's available on all GitHub-hosted runners.

```diff
-      - uses: maxmilton/action-create-release@v0
-        with:
-          files: |
-            chrome-extension.zip
-          git-tag: ${{ github.ref }}
-          github-token: ${{ secrets.GITHUB_TOKEN }}
+      - run: gh release create "${{ github.ref_name }}" --draft --generate-notes
+        shell: bash
+        env:
+          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

[![Build status](https://img.shields.io/github/actions/workflow/status/maxmilton/action-create-release/ci.yml?branch=master)](https://github.com/maxmilton/action-create-release/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/maxmilton/action-create-release)](https://codeclimate.com/github/maxmilton/action-create-release)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/maxmilton/action-create-release)](https://github.com/maxmilton/action-create-release/releases)
[![Licence](https://img.shields.io/github/license/maxmilton/action-create-release.svg)](https://github.com/maxmilton/action-create-release/blob/master/LICENSE)

# action-create-release

A GitHub action to create a new GitHub release with optional asset files in your CI workflow.

## Usage

> NOTE: The `files` input currently only supports `.zip` files. Only valid relative or absolute paths are allowed and globs are not supported.

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
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

Also, see [this repo's `publish.yml` workflow](.github/workflows/publish.yml) for an example.

## Bugs

Please report any bugs you encounter on the [GitHub issue tracker](https://github.com/maxmilton/action-create-release/issues).

## Changelog

See [releases on GitHub](https://github.com/maxmilton/action-create-release/releases).

## License

MIT license. See [LICENSE](https://github.com/maxmilton/action-create-release/blob/master/LICENSE).

---

© 2023 [Max Milton](https://maxmilton.com)
