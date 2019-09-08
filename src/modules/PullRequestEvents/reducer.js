const { endpoint } = require ('../../common/redux/utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = [[
  {
    at: '2019-09-07T08:20:10Z',
    eventLabel: 'COMMIT',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T08:50:10Z',
    eventLabel: 'COMMIT',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T08:50:10Z',
    eventLabel: 'COMMIT : PUSH',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T09:20:00Z',
    eventLabel: 'REVIEW : REQUEST',
    authorOrActor: 'user1',
    targetUser: 'user2',
    delay: null,
  },
  {
    at: '2019-09-07T09:25:00Z',
    eventLabel: 'REVIEW : REQUEST',
    authorOrActor: 'user1',
    targetUser: 'user3',
    delay: null,
  },
  {
    at: '2019-09-07T09:45:12Z',
    eventLabel: 'REVIEW : COMMENT',
    authorOrActor: 'user2',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T12:15:16Z',
    eventLabel: 'REVIEW : CHANGE REQUEST',
    authorOrActor: 'user2',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T13:11:56Z',
    eventLabel: 'COMMIT',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T13:11:56Z',
    eventLabel: 'COMMIT : PUSH',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-07T15:50:40Z',
    eventLabel: 'REVIEW : REQUEST',
    authorOrActor: 'user1',
    targetUser: 'user2',
    delay: null,
  },
  {
    at: '2019-09-08T08:30:55Z',
    eventLabel: 'REVIEW : APPROVAL',
    authorOrActor: 'user2',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-08T10:42:00Z',
    eventLabel: 'MERGE',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
  {
    at: '2019-09-08T10:45:00Z',
    eventLabel: 'DELETE',
    authorOrActor: 'user1',
    targetUser: null,
    delay: null,
  },
]]

//---------------------------------
// actions
//---------------------------------

const FOCUS_PULL_REQUEST_EVENT = 'app/PullRequests/FOCUS_PULL_REQUEST_EVENT'

module.exports.actions = {
  FOCUS_PULL_REQUEST_EVENT,
}

//---------------------------------
// action creators
//---------------------------------

const focusPullRequestEvent = index => ({ type: FOCUS_PULL_REQUEST_EVENT, payload: index })

module.exports.actionCreators = {
  focusPullRequestEvent,
}

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {}

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
