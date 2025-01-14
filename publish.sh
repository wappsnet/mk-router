#!/bin/bash

set -x

set -e

git status

# Get the latest commit message
latest_commit_message=$(git log --format=%B -n 1 HEAD)

echo "Release Type: $1"

PACKAGE_VERSION=$(node -pe "require('./package.json').version")

if [ "$1" = "release" ]
then
  # Check if the commit message contains the word "fix"
  if [[ "$latest_commit_message" = *type:patch* ]]; then
    # Increment the patch version
    echo "Generating Patch version"
    npm version patch --no-git-tag-version --no-commit-hooks --allow-same-version
  elif [[ $latest_commit_message = *type:major* ]]; then
    # Increment the minor version by default
    echo "Generating Major version"
    npm version major --no-git-tag-version --no-commit-hooks --allow-same-version
  else
    echo "Generating Minor version"
    npm version minor --no-git-tag-version --no-commit-hooks --allow-same-version
  fi

  # Obtain the package version from package.json
  PACKAGE_VERSION=$(node -pe "require('./package.json').version")
  echo "Generated version: $PACKAGE_VERSION"
  git tag -a "v$PACKAGE_VERSION" -m "Beta version $PACKAGE_VERSION"
elif [ "$1" = "prerelease" ]
then
  echo "Generating Minor version"
  npm version prerelease --no-git-tag-version --no-commit-hooks --allow-same-version

  # Obtain the package version from package.json and tag it as release version
  PACKAGE_VERSION=$(node -pe "require('./package.json').version")
  echo "Generated version: $PACKAGE_VERSION"
  git tag -a "v$PACKAGE_VERSION" -m "Release version $PACKAGE_VERSION"
fi

# Push the new tag to the remote repository
echo "Pushing Tags to origin"
git push origin "v$PACKAGE_VERSION"

# Publish to npm
echo "Publishing new version"
npm publish

git add .
git commit -m "Release version $PACKAGE_VERSION"
git push