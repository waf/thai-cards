Thai Flash Cards
================

A webapp (for desktop and mobile) to help me learn Thai vocab: http://fuqua.io/thai-cards/. Works with or without an internet connection.

To install it as a mobile app, visit the above link and choose "Add to Homescreen" from your browser options.

Adding More Words
=================

To add more words to an existing module, just add the words to the appropriate file in the `modules` directory.

To add a new module, create a new file in the `modules` folder, and then list that module in the `modules.json` file.

To notify offline clients that the app has changed update the `mobile/offline.appcache`. Add any additional files and bump the version number.

Developing
==========

If you would like to contribute to the development of this app, here are some development tips:

1. This app is written in [React.js](http://facebook.github.io/react/).
1. Use the `index.dev.html` file to test, rather than the `index.html` file. `index.html` uses offline-caching and minified scripts, which makes debugging difficult.
1. Since this app uses AJAX, you'll also want to access it via HTTP while developing (as opposed to `file://` URIs). Easiest way to do that is to run a local HTTP server. If you have python3 installed, use `python3 -m http.server`
