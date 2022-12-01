#!/bin/sh
yarn install
npm run build
yarn electron-build --overwrite