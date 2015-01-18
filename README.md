Thai Flash Cards
================

A webapp (for desktop and mobile) to help me learn Thai vocab: http://fuqua.io/thai-cards/. Works with or without an internet connection.

To install it as a mobile app, visit the above link and choose "Add to Homescreen" from your browser options.

Developing
==========

If you're technical and would like to contribute, here are some development tips:

1. Uncomment the DEBUG scripts in `index.html`, and comment out the `react.min.js` and `game.min.js` scripts. 
1. To avoid caching issues, disable the offline-caching functionality by removing the html tag's manifest attribute.
1. Since this app uses AJAX, you'll also want to access it via HTTP while developing (as opposed to `file://` URIs). Easiest way to do that is to run a local HTTP server. If you have python3 installed, use `python3 -m http.server`
