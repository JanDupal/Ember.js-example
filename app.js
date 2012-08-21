
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

var drinks = {
  _lastId: 3,
  _content: [
    { id: 1, name: 'Beer', alcohol: 4.5, deleted: false },
    { id: 2, name: 'Da beer', alcohol: 6.5, deleted: false },
    { id: 3, name: 'New beer', alcohol: 3.5, deleted: false }
  ],

  all: function() {
    return this._content.filter(function(d) { return !d.deleted });
  },

  create: function(attrs) {
    if(attrs.name && attrs.alcohol) {
      attrs.id = ++this._lastId;
      attrs.deleted = false;
      this._content.push(attrs);
      return attrs;
    }
    else {
      return null;
    }
  },

  delete: function(id) {
    var drink = this.find(id);
    if(drink) {
      drink.deleted = true;
    }
    return drink;
  },

  find: function(id) {
    return this._content.filter(
        function(d) { return d.id == id }
    )[0];
  }
};

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
  res.send({ drinks: drinks.all() });
});


app.post('/drinks', function(req, res) {
  var drink = drinks.create(req.body.drink);
  if(drink) {
    res.send({ drink: drink });
    notifyAll('drink created', { id: drink.id });
  }
  else{
    console.log(drink);
    res.send(400);
  }
});

app.get('/drinks/:id', function(req, res) {
  var drink = drinks.find(req.params.id);
  if(drink) {
    res.send({ drink: drink });
  }
  else{
    console.log(req.params.id);
    console.log(drinks.all());
    res.send(404);
  }
});

app.delete('/drinks/:id', function(req, res) {
  var drink = drinks.delete(req.params.id);
  if(drink) {
    res.send({ drink: drink });
    notifyAll('drink deleted', { id: drink.id });
  }
  else{
    console.log(req.params.id);
    console.log(drinks.all());
    res.send(400);
  }
});

function notifyAll(msg, data) {
  io.sockets.emit(msg, data || {});
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
