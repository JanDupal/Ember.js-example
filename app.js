
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var drinks = [
  { id: 1, name: 'Beer', alcohol: 45 },
  { id: 2, name: 'Da beer', alcohol: 65 }
];
var lastId = 2;

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
  res.send({ drinks: drinks });
});


app.post('/drinks', function(req, res) {
  var drink = req.body.drink;
  if(drink.name && drink.alcohol) {
    drink.id = ++lastId;
    drinks.push(drink);
    res.send({ drink: drink });
  }
  else{
    console.log(drink);
  }
});

app.delete('/drinks/:id', function(req, res) {
  var idx = null;
  drinks.forEach(function (element, index, array){
    if(element.id == req.params.id) { idx = index}
  });

  if(idx !== null) {
    drinks.splice(idx, 1);
    res.send(200);
  }
  else{
    console.log(req.params.id);
    console.log(drinks);
  }
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
