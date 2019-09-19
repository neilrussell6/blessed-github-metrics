const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils')
const _R = require ('../../common/utils/ramda.utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = []

//---------------------------------
// actions
//---------------------------------

const GET_PULL_REQUESTS_SUCCESS = 'modules/PullRequests/GET_PULL_REQUESTS_SUCCESS'

module.exports.actions = {
  GET_PULL_REQUESTS_SUCCESS,
}

//---------------------------------
// action creators
//---------------------------------

const getPullRequestsSuccess = payload => ({ type: GET_PULL_REQUESTS_SUCCESS, payload })

module.exports.actionCreators = {
  getPullRequestsSuccess,
}

//---------------------------------
// reducers
//---------------------------------

const setPullRequests = (state, { payload }) => R.pipe (
  R.path (['repository', 'pullRequests', 'nodes']),
  R.map (R.evolve ({ author: R.prop ('login') })),
  R.map (_R.renameKeys ({ author: 'authorLogin' })),
  R.reverse,
) (payload)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [GET_PULL_REQUESTS_SUCCESS]: setPullRequests,
}

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
