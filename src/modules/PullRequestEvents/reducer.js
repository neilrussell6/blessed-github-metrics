const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils')
const { eventTypeToLabelMap } = require('./constants')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = []

//---------------------------------
// actions
//---------------------------------

const FOCUS_PULL_REQUEST_EVENT = 'modules/PullRequestEvents/FOCUS_PULL_REQUEST_EVENT'

const HTTP_GET_PULL_REQUEST_EVENTS = 'modules/PullRequestEvents/HTTP_GET_PULL_REQUEST_EVENTS'
const HTTP_GET_PULL_REQUEST_EVENTS_SUCCESS = 'modules/PullRequestEvents/HTTP_GET_PULL_REQUEST_EVENTS_SUCCESS'
const HTTP_GET_PULL_REQUEST_EVENTS_FAILURE = 'modules/PullRequestEvents/HTTP_GET_PULL_REQUEST_EVENTS_FAILURE'

const actions = {
  FOCUS_PULL_REQUEST_EVENT,
  HTTP_GET_PULL_REQUEST_EVENTS,
  HTTP_GET_PULL_REQUEST_EVENTS_SUCCESS,
  HTTP_GET_PULL_REQUEST_EVENTS_FAILURE,
}

//---------------------------------
// action creators
//---------------------------------

const focusPullRequestEvent = index => ({ type: FOCUS_PULL_REQUEST_EVENT, payload: index })

const httpGetPullRequestEvents = pullRequest => ({ type: HTTP_GET_PULL_REQUEST_EVENTS, payload: pullRequest })
const httpGetPullRequestEventsSuccess = pullRequestEvent => ({ type: HTTP_GET_PULL_REQUEST_EVENTS_SUCCESS, payload: pullRequestEvent })
const httpGetPullRequestEventsFailure = message => ({ type: HTTP_GET_PULL_REQUEST_EVENTS_FAILURE, payload: message })

const actionCreators = {
  focusPullRequestEvent,
  httpGetPullRequestEvents,
  httpGetPullRequestEventsSuccess,
  httpGetPullRequestEventsFailure,
}

//---------------------------------
// reducers
//---------------------------------

const setPullRequestEvents = (state, { payload }) => R.pipe (
  R.path (['repository', 'pullRequests', 'nodes', 0, 'timelineItems', 'nodes']),
  // ... transform commit event to look more like other events
  R.map (R.ifElse (
    R.has ('commit'),
    R.pipe (
      R.converge (R.mergeDeepRight, [R.prop ('commit'), R.pick (['__typename'])]),
      R.evolve ({ actor: R.prop ('user') }),
    ),
    R.identity,
  )),
  // ... flatten user fields
  R.map (R.evolve ({
    author: x => R.pathOr (R.prop ('login') (x)) (['user', 'login']) (x),
    actor: R.prop ('login'),
    requestedReviewer: R.prop ('login'),
  })),
  // ... map result fields
  R.map (x => ({
    eventLabel: R.prop (x.state ? `${x.__typename}__${x.state}` : x.__typename) (eventTypeToLabelMap),
    at: R.compose (R.head, R.filter (R.complement (R.isNil)), R.values, R.pick (['pushedDate', 'createdAt', 'submittedAt'])) (x),
    authorOrActor: x.actor ? x.actor : x.author,
    targetUser: x.requestedReviewer ? x.requestedReviewer : null,
    delay: null,
  })),
  // ... reverse order
  R.reverse,
) (payload)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [HTTP_GET_PULL_REQUEST_EVENTS_SUCCESS]: setPullRequestEvents,
}

const reducer = endpoint (reducers, INITIAL_STATE)

module.exports = {
  INITIAL_STATE,
  ...actions,
  ...actionCreators,
  reducer,
}
