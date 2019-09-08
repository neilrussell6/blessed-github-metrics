const { reducer, actions, actionCreators } = require ('./reducer')
const Container = require ('./container')
const epics = require ('./epics')

module.exports = {
  Component: Container,
  reducer,
  ...actions,
  ...actionCreators,
  epics,
}
