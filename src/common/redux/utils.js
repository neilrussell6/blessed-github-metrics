const R = require ('ramda')

const endpoint = (reducers, defaultState = null) => (
  (currentState, action) => {
    const state = currentState == null ? defaultState : currentState
    return R.has (action.type, reducers)
      ? reducers[action.type](state, action)
      : state
  }
)

module.exports.endpoint = endpoint
