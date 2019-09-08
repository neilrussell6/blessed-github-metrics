const Container = require ('./container')
const { reducer, actions, actionCreators } = require ('./reducer')

module.exports = {
  Component: Container,
  reducer,
  ...actions,
  ...actionCreators,
}
