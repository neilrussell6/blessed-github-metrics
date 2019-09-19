const { endpoint } = require ('../../common/redux/utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = null

//---------------------------------
// actions
//---------------------------------

const FOCUS_PULL_REQUEST = 'modules/PullRequest/FOCUS_PULL_REQUEST'

const SELECT_PULL_REQUEST = 'modules/PullRequests/SELECT_PULL_REQUEST'

module.exports.actions = {
  FOCUS_PULL_REQUEST,
  SELECT_PULL_REQUEST,
}

//---------------------------------
// action creators
//---------------------------------

const focusPullRequest = index => ({ type: FOCUS_PULL_REQUEST, payload: index })

const selectPullRequest = data => ({ type: SELECT_PULL_REQUEST, payload: data })

module.exports.actionCreators = {
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

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
