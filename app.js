
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var drinks = [
  { id: 1, name: 'Beer', alcohol: 45 },
  { id: 2, name: 'Da beer', alcohol: 65 },
  { id: 3, name: 'New beer', alcohol: 35 }
];
var lastId = 3;

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
    notifyAll('drink created', { id: drink.id });
  }
  else{
    console.log(drink);
    res.send(400);
  }
});

app.get('/drinks/:id', function(req, res) {
  var idx = findDrinkIndexById(req.params.id);

  if(idx !== null) {
    var drink = drinks[idx];
    res.send({ drink: drink });
  }
  else{
    console.log(req.params.id);
    console.log(drinks);
    res.send(404);
  }
});

app.delete('/drinks/:id', function(req, res) {
  var idx = findDrinkIndexById(req.params.id);

  if(idx !== null) {
    var drink = drinks[idx];
    drinks.splice(idx, 1);
    res.send({ drink: drink });
    notifyAll('drink deleted', { id: drink.id });
  }
  else{
    console.log(req.params.id);
    console.log(drinks);
    res.send(400);
  }
});

function findDrinkIndexById(id) {
  var idx = null;
  drinks.forEach(function (element, index, array){
    if(element.id == id) { idx = index}
  });

  return idx;
}

function notifyAll(msg, data) {
  io.sockets.emit(msg, data || {});
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
