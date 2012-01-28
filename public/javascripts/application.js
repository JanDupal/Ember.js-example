(function() {
  var App, socket;

  window.App = App = Ember.Application.create();

  App.store = DS.Store.create({
    adapter: DS.RESTAdapter.create({
      bulkCommit: false
    })
  });

  App.Drink = DS.Model.extend({
    id: DS.attr('integer'),
    name: DS.attr('string'),
    alcohol: DS.attr('integer'),
    image: (function() {
      return '/images/' + this.get('id') + '.png';
    }).property('id')
  });

  App.DrinksView = Ember.View.extend({
    drinksBinding: 'App.drinksController.content',
    destroyDrink: function(e) {
      return App.drinksController.destroy(e.get('drink'));
    }
  });

  App.NewDrinkView = Ember.View.extend({
    newDrink: {},
    create: function() {
      App.drinksController.create(this.newDrink);
      return this.set('newDrink', {});
    }
  });

  App.drinksController = Ember.Object.create({
    content: [],
    populate: function() {
      return this.set('content', App.store.findAll(App.Drink));
    },
    reload: function() {
      App.store.typeMapFor(App.Drink).findAllCache = null;
      return this.populate();
    },
    create: function(drink) {
      App.store.createRecord(App.Drink, drink);
      return App.store.commit();
    },
    destroy: function(drink) {
      drink.deleteRecord();
      return App.store.commit();
    }
  });

  App.statechart = SC.Statechart.create({
    autoInitStatechart: true,
    rootState: SC.State.extend({
      enterState: function() {
        return App.drinksController.populate();
      }
    })
  });

  socket = io.connect();

  socket.on('data changed', function() {
    return App.drinksController.reload();
  });

}).call(this);
