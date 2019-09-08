const { reducer, actions, actionCreators } = require ('./reducer')
const Container = require ('./container')

module.exports = {
  Component: Container,
  reducer,
  ...actions,
  ...actionCreators,
}
