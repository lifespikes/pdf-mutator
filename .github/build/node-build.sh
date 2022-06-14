#!/bin/sh

cd /var/task || exit 1;

npm install -g typescript
npm install
tsc -p tsconfig.json && rm -rf node_modules

NODE_ENV=production npm install --production && mv node_modules dist/node_modules
npm install adm-zip
node build/archive.js
