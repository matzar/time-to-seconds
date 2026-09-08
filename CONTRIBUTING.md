# Contributing

## Requirements

- Node.js 20 or newer to use and test the package
- Node.js 24 to run the release toolchain (`semantic-release` requires
  `^22.14.0 || >=24.10.0`)

## Commands

```sh
npm test              # run the suite on node:test
npm run test:coverage # same, with a coverage summary
npm run format        # apply Prettier
npm run format:check  # verify formatting (what CI runs)
```

The package itself has **no runtime dependencies** and the tests use only
`node:test` and `node:assert`, so `npm test` works on a bare checkout with no
`npm install`. `npm audit --omit=dev` is the meaningful audit for consumers.

## Commits drive releases

Every push to `master` runs `semantic-release`, so the commit message decides
the version. This repo squash-merges, which means **the pull request title
becomes the commit message** and therefore decides the release.

| Commit type                                                                                    | Release |
| ---------------------------------------------------------------------------------------------- | ------- |
| `feat:`                                                                                        | minor   |
| `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `build:`, `ci:`, `perf:`, `revert:` | patch   |
| a `BREAKING CHANGE:` footer                                                                    | major   |

A commit that matches no rule publishes nothing. The **Dry Release** check on
each pull request prints the version that merging would publish.

## Release pipeline

On every push to `master`, [`release.yml`](.github/workflows/release.yml):

1. runs the tests
2. works out the next version from the commits
3. writes `CHANGELOG.md` and commits it with `package.json` back to `master`
   (with `[skip ci]`, so it does not retrigger itself)
4. publishes `time-to-seconds` to npmjs.com
5. publishes `@matzar/time-to-seconds` to GitHub Packages via
   [`scripts/publish-gpr.sh`](scripts/publish-gpr.sh)
6. creates the git tag and the GitHub release

## One-time setup

These live outside the repository and have to be configured by hand.

### 1. npm trusted publishing (no token needed)

Publishing uses OIDC trusted publishing rather than an `NPM_TOKEN` secret. npm
is removing publish rights from 2FA-bypass granular access tokens in **January
2027**, so a stored token is a dead end.

On npmjs.com, open the `time-to-seconds` package → _Settings_ → _Trusted
Publisher_, and add a GitHub Actions publisher:

| Field             | Value             |
| ----------------- | ----------------- |
| Organization/user | `matzar`          |
| Repository        | `time-to-seconds` |
| Workflow filename | `release.yml`     |
| Environment       | _(leave empty)_   |

No secret is stored anywhere. `id-token: write` in `release.yml` is what lets
the workflow prove its identity.

The publisher **must be allowed to run `npm publish` directly**, not only
`npm stage publish`. Configurations created after 3 September 2026 default to
stage-only, and `@semantic-release/npm` has no support for staged publishing:
it always shells out to `npm publish`. Check the _Permissions_ line on the
trusted publisher and use _Edit_ if it reads `npm stage publish` alone.

This is worth getting right before the first release, because
`semantic-release` tags and pushes **before** it publishes. A stage-only
publisher therefore fails after `v<next>` is already on `master`, leaving a
tag with nothing published behind it. Recovering means deleting the tag, the
release commit, and re-running.

> If you would rather approve every release by hand, the alternative is to set
> `npmPublish: false` on `@semantic-release/npm` and run `npm stage publish`
> from an `exec` step instead. That buys a 2FA approval gate per release, at
> the cost of releases no longer being hands-off.

### 2. `RELEASE_TOKEN` (only while `master` is protected)

`master` requires status checks, which blocks the release commit that
`@semantic-release/git` pushes. The workflow token cannot bypass that, so a
classic PAT with `repo` scope from a repository admin is needed:

```sh
gh secret set RELEASE_TOKEN
```

If it is absent the release fails in the _prepare_ step, before anything is
published, so there is no risk of a half-finished release. The alternative is
to drop `@semantic-release/git` from `.releaserc` and let the git tag be the
only record of the version.

### 3. Branch protection

The required status check on `master` is **CI**, a job that exists purely to
give branch protection one stable name to depend on. Do not require the
**Test** contexts directly: `Test` is a matrix job, so its real contexts are
`Test (20.x)`, `Test (22.x)` and so on, and requiring those wedges every pull
request as soon as the matrix changes.

Historically the only required check was **Dry Release**, which passed
unconditionally — `semantic-release` returns early on `pull_request` events
without checking anything, so the check never verified a thing.

```sh
gh api -X PATCH repos/matzar/time-to-seconds/branches/master/protection/required_status_checks \
  -f 'checks[][context]=CI' \
  -f 'checks[][context]=Dry Release'
```
