const { reducer, actions, actionCreators } = require ('./reducer')

module.exports = {
  reducer,
  ...actions,
  ...actionCreators,
}
