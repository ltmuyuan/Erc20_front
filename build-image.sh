#!/bin/bash
#rm -rf dist/
#yarn build
docker build -t hamstershare/nft-trade:$1 .
docker run --rm -p 8080:80 hamstershare/nft-trade:$1
