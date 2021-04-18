#!/bin/bash

set -e

: "${SOURCE_BRANCH:=source}"
: "${TARGET_BRANCH:=master}"
: "${ORIGIN:=origin}"
: "${CNAME_URL:=wchargin.com}"

# Disable this if you've already run 'npm build'.
: "${BUILD:=true}"

# Explode and deploy the contents of this directory.
EXPLODE=dist

# Adapted from:
# https://github.com/git/git/blob/8d530c4d64ffcc853889f7b385f554d53db375ed/git-sh-setup.sh#L207-L222
ensure_clean_working_tree() {
    local err=0
    if ! git diff-files --quiet --ignore-submodules; then
        echo >&2 "Cannot deploy: You have unstaged changes."
        err=1
    fi
    if ! git diff-index --cached --quiet --ignore-submodules HEAD -- ; then
        if [[ "$err" -eq 0 ]]; then
            echo >&2 "Cannot deploy: Your index contains uncommitted changes."
        else
            echo >&2 "Additionally, your index contains uncommitted changes."
        fi
        err=1
    fi
    if [[ "$err" -ne 0 ]]; then
        exit "$err"
    fi
}

ensure_no_stopships() {
    if git grep -n -i "STOPSHIP" -- './*' ':!deploy.sh'; then
        echo >&2 "Cannot deploy: STOPSHIP annotations remain."
        exit 1
    fi
}

ensure_up_to_date() {
    git fetch "$ORIGIN"
    if [ "$(git rev-parse "$ORIGIN/$SOURCE_BRANCH")" \
            != "$(git rev-parse "$SOURCE_BRANCH")" ]; then
        echo >&2 "Cannot deploy: not up to date with $ORIGIN/$SOURCE_BRANCH."
        exit 1
    fi
}

prompt() {
    >&2 printf '%s\n' "$1"
    >&2 printf 'yes/no> '
    read line
    if [[ "$line" != "yes" ]]; then
        >&2 printf '%s\n' "Aborting!"
    fi
    printf '%s' "$line"
}

if [[ "$(git rev-parse --abbrev-ref HEAD)" != "$SOURCE_BRANCH" ]]; then
    msg="You're not on '$SOURCE_BRANCH'. Do you want to go there now?"
    if [[ "$(prompt "$msg")" != "yes" ]]; then
        exit 0
    else
        git checkout "$SOURCE_BRANCH"
    fi
fi

ensure_clean_working_tree
ensure_no_stopships
ensure_up_to_date

SOURCE_COMMIT="$(git rev-parse HEAD)"
printf 'Preparing to deploy commit %s.\n' "$SOURCE_COMMIT"

TMPDIR="$(mktemp -d)"
printf 'Temporary directory: %s\n' "$TMPDIR"

if [[ "$BUILD" == "true" ]]; then
    npm run build
else
    printf '%s\n' "Warning: skipping build."
fi
cp -r "$EXPLODE"/* "$TMPDIR"
pushd "$TMPDIR"
if [ -e CNAME ]; then
    printf >&2 'CNAME file would conflict with build output. Aborting.\n'
    exit 1
fi
printf '%s\n' "${CNAME_URL}" >CNAME
STAGE=( * )
popd

git checkout --orphan "$TARGET_BRANCH" || git checkout "$TARGET_BRANCH"
git rm -r --cached --ignore-unmatch .
cp -r "$TMPDIR"/* .
git add "${STAGE[@]}"
git commit --allow-empty --no-verify -m "Deploy: $SOURCE_COMMIT"

echo
printf 'Please review the build output now---run:\n'
printf '    cd "%s" && python3 -m http.server\n' "$TMPDIR"
msg="Do you want to deploy?"
if [[ "$(prompt "$msg")" == "yes" ]]; then
    if [[ -n "$DRY_RUN" ]]; then
        printf '(DRY_RUN is set; skipping push to remote.)\n'
    else
        git push origin "$TARGET_BRANCH"
    fi
fi

git clean -xfde node_modules
git checkout "$SOURCE_BRANCH"
rm -rf "$TMPDIR"
