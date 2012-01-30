window.App = App = Ember.Application.create()

# Models

App.store = DS.Store.create
  adapter: DS.RESTAdapter.create({ bulkCommit: false })

App.Drink = DS.Model.extend
  id:      DS.attr('integer')
  name:    DS.attr('string')
  alcohol: DS.attr('integer')
  image: (-> '/images/' + this.get('id') + '.png').property('id')

# Views

App.DrinksView = Ember.View.extend
  drinksBinding: 'App.drinksController.content'

  destroyDrink: (e) ->
    App.drinksController.destroy(e.get('drink'))

App.NewDrinkView = Ember.View.extend
  newDrink: {}

  create: ->
    App.drinksController.create(this.newDrink)
    this.set('newDrink', {})

# Controllers

App.drinksController = Ember.Object.create
  content: []

  populate: ->
    this.set('content', App.store.findAll(App.Drink))

  reload: ->
    App.cleanCache(App.Drink)
    this.populate()

  create: (drink) ->
    App.store.createRecord(App.Drink, drink)
    App.store.commit()

  destroy: (drink) ->
    drink.deleteRecord()
    App.store.commit()

# Statechart

App.statechart = SC.Statechart.create
  autoInitStatechart: true

  rootState: SC.State.extend
    enterState: -> App.drinksController.populate()

# Socket.IO

socket = io.connect()

socket.on 'data changed', ->
  App.drinksController.reload()

socket.on 'drink created', (data) ->
  App.store.find(App.Drink, data.id)

socket.on 'drink deleted', (data) ->
  drink = App.store.find(App.Drink, data.id)
  App.store.removeFromModelArrays(drink)

# Utils

App.cleanCache = (type) ->
  typeMap = App.store.typeMapFor(type)

  typeMap.findAllCache = null
  typeMap.cidList = []
  typeMap.cidToHash = {}
  typeMap.idList = []
  typeMap.idToCid = {}
