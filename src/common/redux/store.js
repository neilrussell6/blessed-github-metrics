const { combineReducers, createStore, applyMiddleware } = require ('redux')
const { createEpicMiddleware } = require ('redux-observable')

const { reducer: app } = require ('../../modules/App')
const { reducer: pullRequest } = require ('../../modules/PullRequest')
const { utils: httpUtils } = require ('../modules/HTTP')
const { reducer: pullRequests } = require ('../../modules/PullRequests')
const { reducer: pullRequestEvents } = require ('../../modules/PullRequestEvents')
const { reducer: message } = require ('../../modules/Message')
const { rootEpic } = require ('./epics')
const { initApp } = require ('../../modules/App')

const GITHUB_COMMON_HEADERS = {
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}
const GITHUB_API_URL = process.env.GITHUB_API_URL
const githubHttpUtils = httpUtils.factory (GITHUB_COMMON_HEADERS) (GITHUB_API_URL)

const configureStore = () => {
  const epicMiddleware = createEpicMiddleware ({
    dependencies: {
      githubHttpUtils,
    },
  })

  const middleware = [
    epicMiddleware,
  ]

  const reducer = combineReducers ({
    app,
    pullRequest,
    pullRequests,
    pullRequestEvents,
    message,
  })

  const store = createStore (reducer, {}, applyMiddleware (...middleware))

  epicMiddleware.run (rootEpic)

  store.dispatch (initApp ())

  return store
}

module.exports.configureStore = configureStore
