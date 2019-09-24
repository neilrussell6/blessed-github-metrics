const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils')
const _R = require ('../../common/utils/ramda.utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = []

//---------------------------------
// actions
// HTTP: get, update, create, delete
//---------------------------------

const HTTP_GET_PULL_REQUESTS = 'modules/PullRequests/HTTP_GET_PULL_REQUESTS'
const HTTP_GET_PULL_REQUESTS_SUCCESS = 'modules/PullRequests/HTTP_GET_PULL_REQUESTS_SUCCESS'
const HTTP_GET_PULL_REQUESTS_FAILURE = 'modules/PullRequests/HTTP_GET_PULL_REQUESTS_FAILURE'

const actions = {
  HTTP_GET_PULL_REQUESTS,
  HTTP_GET_PULL_REQUESTS_SUCCESS,
  HTTP_GET_PULL_REQUESTS_FAILURE,
}

//---------------------------------
// action creators
//---------------------------------

const httpGetPullRequests = payload => ({ type: HTTP_GET_PULL_REQUESTS, payload })
const httpGetPullRequestsSuccess = payload => ({ type: HTTP_GET_PULL_REQUESTS_SUCCESS, payload })
const httpGetPullRequestsFailure = payload => ({ type: HTTP_GET_PULL_REQUESTS_FAILURE, payload })

const actionCreators = {
  httpGetPullRequests,
  httpGetPullRequestsSuccess,
  httpGetPullRequestsFailure,
}

//---------------------------------
// reducers
//---------------------------------

const extractTotal = R.pipe (
  R.prop ('totalCount'),
  R.ifElse (R.equals (0)) (R.always ('-')) (R.identity),
)

const setPullRequests = (state, { payload }) => R.pipe (
  R.path (['repository', 'pullRequests', 'nodes']),
  // ... flatten user fields
  R.map (R.evolve ({
    author: R.prop ('login'),
    mergedBy: R.prop ('login'),
  })),
  // ... extract and transform total fields
  R.map (R.evolve ({
    reviewRequests: extractTotal,
    reviewsApproved: extractTotal,
    reviewsChangesRequested: extractTotal,
  })),
  R.reverse,
) (payload)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [HTTP_GET_PULL_REQUESTS_SUCCESS]: setPullRequests,
}

const reducer = endpoint (reducers, INITIAL_STATE)

module.exports = {
  INITIAL_STATE,
  ...actions,
  ...actionCreators,
  reducer,
}
