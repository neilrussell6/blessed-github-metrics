const { endpoint } = require ('../../common/redux/utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = null

//---------------------------------
// actions
//---------------------------------

const FOCUS_PULL_REQUEST = 'modules/PullRequest/FOCUS_PULL_REQUEST'

const SELECT_PULL_REQUEST = 'modules/PullRequest/SELECT_PULL_REQUEST'

const actions = {
  FOCUS_PULL_REQUEST,
  SELECT_PULL_REQUEST,
}

//---------------------------------
// action creators
//---------------------------------

const focusPullRequest = index => ({ type: FOCUS_PULL_REQUEST, payload: index })

const selectPullRequest = data => ({ type: SELECT_PULL_REQUEST, payload: data })

const actionCreators = {
  focusPullRequest,
  selectPullRequest,
}

//---------------------------------
// reducers
//---------------------------------

const setPullRequest = (state, { payload }) => payload

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [SELECT_PULL_REQUEST]: setPullRequest,
}

const reducer = endpoint (reducers, INITIAL_STATE)

module.exports = {
  INITIAL_STATE,
  ...actions,
  ...actionCreators,
  reducer,
}
