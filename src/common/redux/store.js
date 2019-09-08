const { combineReducers, createStore } = require ('redux')

const { reducer: app } = require ('../../modules/App')
const { reducer: pullRequests } = require ('../../modules/PullRequests')
const { reducer: message } = require ('../../modules/Message')

const configureStore = () => {
  const reducer = combineReducers ({
    app,
    pullRequests,
    message,
  })
  return createStore (reducer, {})
}

module.exports.configureStore = configureStore
