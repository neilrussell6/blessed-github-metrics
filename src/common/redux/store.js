const { combineReducers, createStore, applyMiddleware } = require ('redux')
const { createEpicMiddleware } = require ('redux-observable')

const { middleware: rabbitmqLogger } = require ('../redux-middleware/rabbitmq-logger')
const { reducer: app } = require ('../../modules/App')
const { reducer: pullRequests, utils: pullRequestsUtils } = require ('../../modules/PullRequests')
const { reducer: pullRequestEvents } = require ('../../modules/PullRequestEvents')
const { reducer: message } = require ('../../modules/Message')
const { rootEpic } = require ('./epics')
const { initApp } = require('../../modules/App')

const configureStore = () => {
  const epicMiddleware = createEpicMiddleware ({
    dependencies: {
      pullRequestsUtils,
    },
  })

  const middleware = [
    epicMiddleware,
    rabbitmqLogger,
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
