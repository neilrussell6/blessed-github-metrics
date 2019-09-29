const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils')
const { eventTypeToLabelMap, participantRoles, eventTypes, pullRequestReviewStates } = require('./constants')

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

const buildParticipant = role => R.mergeDeepRight ({ role })

const buildAuthorParticipant = ({ isActive, isResponsible }) => login => (
  buildParticipant (participantRoles.AUTHOR) ({ isActive, isResponsible, login })
)

const buildReviewerParticipant = ({ isResponsible }) => login => (
  buildParticipant (participantRoles.REVIEWER) ({ isResponsible, login })
)

const buildNewParticipant = existing => R.cond ([
  // ... first commit
  // ... ... add author if new and set as active and responsible
  [
    R.allPass([
      R.propEq ('type') (eventTypes.PULL_REQUEST_COMMIT),
      R.always (R.isEmpty (existing)),
    ]),
    R.compose (R.of, buildAuthorParticipant ({ isActive: true, isResponsible: true }), R.prop ('authorOrActor')),
  ],
  // ... review request
  // ... ... add reviewer if new and set as responsible
  [
    R.allPass([
      R.propEq ('type') (eventTypes.REVIEW_REQUESTED_EVENT),
      R.pipe (
        R.prop ('targetUser'),
        x => R.find (R.propEq ('login') (x)) (existing),
        R.isNil,
      ),
    ]),
    R.compose (R.of, buildReviewerParticipant ({ isResponsible: true }), R.prop ('targetUser')),
  ],
  // ... default
  [R.T, R.always ([])],
])

const updateExistingParticipants = existing => R.cond ([
  // ... re-review request
  // ... ... set reviewer as responsible
  // ... ... set author to not responsible
  [
    R.allPass([
      R.propEq ('type') (eventTypes.REVIEW_REQUESTED_EVENT),
      R.pipe (
        R.prop ('targetUser'),
        x => R.find (R.propEq ('login') (x)) (existing),
        R.allPass ([R.complement (R.isNil), R.propEq ('isResponsible') (false)]),
      ),
    ]),
    R.pipe (
      R.prop ('targetUser'),
      x => R.findIndex (R.propEq ('login') (x)) (existing),
      i => R.adjust (i) (R.assoc ('isResponsible') (true)) (existing),
      _existing => R.pipe (
        () => R.findIndex (R.propEq ('role') (participantRoles.AUTHOR)) (_existing),
        i => R.adjust (i) (R.assoc ('isResponsible') (false)) (_existing),
      ) (_existing),
    ),
  ],
  // ... review request
  // ... ... set author to not responsible
  [
    R.propEq ('type') (eventTypes.REVIEW_REQUESTED_EVENT),
    R.pipe (
      () => R.findIndex (R.propEq ('role') (participantRoles.AUTHOR)) (existing),
      i => R.adjust (i) (R.assoc ('isResponsible') (false)) (existing),
    ),
  ],
  // ... reviewed
  // ... ... set reviewer to not responsible
  // ... ... set author as responsible
  [
    R.allPass([
      R.propEq ('type') (eventTypes.PULL_REQUEST_REVIEW),
      R.propSatisfies (R.includes (R.__, [
        pullRequestReviewStates.CHANGES_REQUESTED,
        pullRequestReviewStates.APPROVED,
      ])) ('state'),
    ]),
    R.pipe (
      R.prop ('authorOrActor'),
      x => R.findIndex (R.propEq ('login') (x)) (existing),
      i => R.adjust (i) (R.assoc ('isResponsible') (false)) (existing),
      _existing => R.pipe (
        R.findIndex (R.propEq ('role') (participantRoles.AUTHOR)),
        i => R.adjust (i) (R.assoc ('isResponsible') (true)) (_existing),
      ) (_existing),
    ),
  ],
  // ... default
  [R.T, R.always (existing)],
])

const buildParticipants = existing => event => {
  const participant = buildNewParticipant (existing) (event)
  const _existing = updateExistingParticipants (existing) (event)
  return R.concat (_existing) (participant)
}

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
    type: x.__typename,
    state: x.state,
    eventLabel: R.prop (x.state ? `${x.__typename}__${x.state}` : x.__typename) (eventTypeToLabelMap),
    at: R.compose (R.head, R.filter (R.complement (R.isNil)), R.values, R.pick (['pushedDate', 'createdAt', 'submittedAt'])) (x),
    authorOrActor: x.actor ? x.actor : x.author,
    targetUser: x.requestedReviewer ? x.requestedReviewer : null,
    delay: null,
  })),
  // ... sort by date
  R.sortBy (R.prop ('at')),
  // ... restrict to 2 contiguous events
  R.groupWith ((x, y) => x.eventLabel === 'COMMIT' && x.eventLabel === y.eventLabel),
  R.map (R.ifElse (
    R.propSatisfies (R.gt(R.__, 2)) ('length'),
    R.converge ((x, y) => [x, y]) ([R.head, R.last]),
    R.identity,
  )),
  R.flatten,
  // ... add participants
  R.addIndex (R.reduce) ((events, event, i) => {
    const previousEvent = i === 0 ? {} : R.nth (i - 1) (events)
    const participants = R.propOr ([]) ('participants') (previousEvent)
    const _participants = buildParticipants (participants) (event)
    const _event = R.assoc ('participants') (_participants) (event)
    return R.concat (events) ([_event])
  }) ([]),
  // ... sort in reverse
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
