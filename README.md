Ember.js Example
================

Simple Ember.js (+ data) + Node.js + Express.js + Socket.io example.

Setup
-----

You will need ruby 1.9.2 (rvmrc file included)
and node.js 0.6.9 (not tested on other versions).

```
bundle
npm install

foreman start
```

Development
-----------

To compile Sass and Coffee script run ```guard```.
Sources for frontend are in ```/assets``` and
get compiled to ```/public```. Node.js ```app.js```
is pure Javascript only.
