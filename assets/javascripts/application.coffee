window.App = App = Ember.Application.create()

App.store = DS.Store.create
  adapter: DS.RESTAdapter.create({ bulkCommit: false })

App.Drink = DS.Model.extend
  name:    DS.attr('string')
  alcohol: DS.attr('integer')
  image: (-> '/images/' + this.get('id') + '.png').property('id')

App.DrinksView = Ember.View.extend
  drinksBinding: 'App.drinksController.content'

App.drinksController = Ember.Object.create
  content: []

  populate: ->
    this.content = App.store.findAll(App.Drink)

App.statechart = SC.Statechart.create
  autoInitStatechart: true

  rootState: SC.State.extend
    enterState: -> App.drinksController.populate()
