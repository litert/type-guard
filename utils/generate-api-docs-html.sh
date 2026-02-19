#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

rm -rf docs/website/guides

cp -r docs/en-US docs/website/guides

mv docs/website/guides/README.md docs/website/guides/index.md
mv docs/website/guides/syntax-guide/README.md docs/website/guides/syntax-guide/index.md

sed -e 's/README.md/index.md/g' -i $(find docs/website/guides -type f -name '*.md')

npm i -D vitepress

npx vitepress build docs/website

npm un -D vitepress

cd $SCRIPT_ROOT/../docs/website/.vitepress/dist

tar -zcf ../html-docs.tgz ./*
