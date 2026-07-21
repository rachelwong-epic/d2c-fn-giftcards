#!/usr/bin/env bash
# Logs npm into Epic's Artifactory registry for the @eds scope.
set -e
REGISTRY="https://artifacts.ol.epicgames.net/artifactory/api/npm/npm-all/"
echo "Logging in to Epic Artifactory registry for @eds scope..."
npm login --registry="$REGISTRY" --scope=@eds
echo "---"
echo "Verifying identity:"
npm whoami --registry="$REGISTRY"
