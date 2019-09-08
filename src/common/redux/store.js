const { combineReducers, createStore, applyMiddleware } = require ('redux')
const { createEpicMiddleware } = require ('redux-observable')

const { reducer: app } = require ('../../modules/App')
const { reducer: pullRequests } = require ('../../modules/PullRequests')
const { reducer: pullRequestEvents } = require ('../../modules/PullRequestEvents')
const { reducer: message } = require ('../../modules/Message')
const { rootEpic } = require ('./epics')
const { initApp } = require('../../modules/App')

const configureStore = () => {
  const epicMiddleware = createEpicMiddleware ({
    dependencies: {},
  })

  const middleware = [
    epicMiddleware,
  ]

  const reducer = combineReducers ({
    app,
    pullRequests,
    pullRequestEvents,
    message,
  })

  const store = createStore (reducer, {}, applyMiddleware (...middleware))

  // TODO: wait for rabbitmq logger is ready before doing this
  epicMiddleware.run (rootEpic)

  store.dispatch (initApp ())

  return store
}

module.exports.configureStore = configureStore
