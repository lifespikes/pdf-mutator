#!/usr/bin/env bash

rm -f dcid
rm -f "$BUILD_DIR/pdf-mutator.zip"

if [ -z "$(cat package.json)" ]; then
  echo "script must be ran from package working dir for proper docker context"
  exit 1
fi

BUILD_DIR=$(dirname "$(readlink -f "$0")")

docker build -f "$BUILD_DIR/Dockerfile" --load -t pdf-mutator:latest .
docker run --cidfile dcid pdf-mutator:latest

CONTAINER_ID=$(cat dcid)

docker cp "$CONTAINER_ID:/var/task/dist/pdf-mutator.zip" "$BUILD_DIR/pdf-mutator.zip"

docker rm --force "$CONTAINER_ID"
rm -f dcid
