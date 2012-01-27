window.App = App = Ember.Application.create()

App.store = DS.Store.create
  adapter: DS.RESTAdapter.create({ bulkCommit: false })

App.Drink = DS.Model.extend
  name:    DS.attr('string')
  alcohol: DS.attr('integer')
  image: (-> '/images/' + this.get('id') + '.png').property('id')

App.DrinksView = Ember.View.extend
  drinks: App.store.findAll(App.Drink)
