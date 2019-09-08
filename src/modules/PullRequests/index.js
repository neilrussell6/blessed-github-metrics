const Container = require ('./container')
const { reducer, actions, actionCreators } = require ('./reducer')
const epics = require ('./epics')
const utils = require ('./utils')

module.exports = {
  Component: Container,
  reducer,
  ...actions,
  ...actionCreators,
  epics,
  utils,
}
