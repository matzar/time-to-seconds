#!/usr/bin/env bash
#
# Mirrors the current build to GitHub Packages under the @matzar scope.
#
# Runs as @semantic-release/exec's publishCmd, straight after
# @semantic-release/npm has published the unscoped package to npmjs.com, so
# package.json already carries the version semantic-release just decided on.
# GitHub Packages only accepts packages scoped to the repository owner, hence
# the temporary rename.
#
# npmjs.com is the primary registry; this is a mirror. A failure here must not
# abort the release, because semantic-release has by this point already
# published to npm and pushed the tag - failing would strand the tag with no
# GitHub release behind it. Problems are surfaced as a workflow warning and
# the script still exits 0.
set -uo pipefail

SCOPED_NAME="@matzar/time-to-seconds"
GPR_REGISTRY="https://npm.pkg.github.com/"

# Prefer a dedicated token so this never depends on whichever token
# semantic-release happens to be using for git and the GitHub release.
TOKEN="${GPR_TOKEN:-${GITHUB_TOKEN:-}}"

warn() {
  # ::warning:: surfaces in the Actions run summary without failing the job.
  echo "::warning title=GitHub Packages mirror::$1"
  echo "GitHub Packages mirror skipped: $1" >&2
}

if [ -z "$TOKEN" ]; then
  warn "neither GPR_TOKEN nor GITHUB_TOKEN is set"
  exit 0
fi

backup="$(mktemp)"
npmrc="$(mktemp)"
cleanup() {
  cp "$backup" package.json
  rm -f "$backup" "$npmrc"
}
trap cleanup EXIT

cp package.json "$backup"

# Both lines matter: the scope mapping tells npm which registry the package
# belongs to, the nerf-darted line supplies the credentials for it.
{
  printf '@matzar:registry=%s\n' "$GPR_REGISTRY"
  printf '//npm.pkg.github.com/:_authToken=%s\n' "$TOKEN"
} >"$npmrc"

npm pkg set name="$SCOPED_NAME" publishConfig.registry="$GPR_REGISTRY"

# --userconfig and --registry are passed on the command line rather than
# through NPM_CONFIG_USERCONFIG: command-line config wins over every other
# source, so nothing semantic-release or setup-node leaves in the environment
# can shadow it. This is the same approach @semantic-release/npm itself takes.
output="$(npm publish --userconfig "$npmrc" --registry "$GPR_REGISTRY" 2>&1)"
status=$?

echo "$output"

if [ "$status" -ne 0 ]; then
  if printf '%s' "$output" | grep -qE 'E409|Cannot publish over existing version'; then
    echo "GitHub Packages already has this version - nothing to do."
  else
    warn "npm publish to $GPR_REGISTRY failed with exit code $status"
  fi
fi

exit 0
