
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
  res.redirect('/index.html');
});

app.get('/drinks', function(req, res) {
  drinks = [
    { id: 1, name: 'Beer', alcohol: 45 },
    { id: 2, name: 'Da beer', alcohol: 65 }
  ];
  res.send({ drinks: drinks });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
