#!/bin/sh

mkdir build
jsx src/ build/
uglifyjs --screw-ie8 lib/ajax.min.js lib/promise.min.js build/util.js build/settings.js build/game.js > game.min.js
rm -r build
