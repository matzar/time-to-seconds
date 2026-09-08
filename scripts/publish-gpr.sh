#!/usr/bin/env bash
#
# Publishes the current build to GitHub Packages under the @matzar scope.
#
# Runs as @semantic-release/exec's publishCmd, straight after
# @semantic-release/npm has published the unscoped package to npmjs.com, so
# package.json already carries the version semantic-release just decided on.
# GitHub Packages only accepts packages scoped to the repository owner, hence
# the temporary rename.
set -euo pipefail

SCOPED_NAME="@matzar/time-to-seconds"
GPR_REGISTRY="https://npm.pkg.github.com/"

# Prefer a dedicated token so this never depends on whichever token
# semantic-release happens to be using for git and the GitHub release.
TOKEN="${GPR_TOKEN:-${GITHUB_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  echo "GPR_TOKEN or GITHUB_TOKEN is required to publish to GitHub Packages" >&2
  exit 1
fi

backup="$(mktemp)"
npmrc="$(mktemp)"
cleanup() {
  cp "$backup" package.json
  rm -f "$backup" "$npmrc"
}
trap cleanup EXIT

cp package.json "$backup"
printf '//npm.pkg.github.com/:_authToken=%s\n' "$TOKEN" >"$npmrc"

npm pkg set name="$SCOPED_NAME" publishConfig.registry="$GPR_REGISTRY"

set +e
output="$(NPM_CONFIG_USERCONFIG="$npmrc" npm publish 2>&1)"
status=$?
set -e

echo "$output"

if [ "$status" -ne 0 ]; then
  if printf '%s' "$output" | grep -qE 'E409|Cannot publish over existing version'; then
    echo "GitHub Packages already has this version - skipping."
  else
    exit "$status"
  fi
fi
