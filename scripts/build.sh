#!/bin/bash

cd "$(dirname "$0")"

mkdir -p build
mkdir -p output

npm ci
tsc --outDir build generate-backdrop.ts

node build/generate-backdrop.js > output/backdrop.svg
