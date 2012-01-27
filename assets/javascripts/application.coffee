window.App = App = Ember.Application.create()

# Models

App.store = DS.Store.create
  adapter: DS.RESTAdapter.create({ bulkCommit: false })

App.Drink = DS.Model.extend
  name:    DS.attr('string')
  alcohol: DS.attr('integer')
  image: (-> '/images/' + this.get('id') + '.png').property('id')

# Views

App.DrinksView = Ember.View.extend
  drinksBinding: 'App.drinksController.content'

# Controllers

App.drinksController = Ember.Object.create
  content: []

  populate: ->
    this.content = App.store.findAll(App.Drink)

# Statechart

App.statechart = SC.Statechart.create
  autoInitStatechart: true

  rootState: SC.State.extend
    enterState: -> App.drinksController.populate()
