const { endpoint } = require ('../../common/redux/utils')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = [
  {
    title: 'GPG-001 - feat(users): add module',
    baseRefName: 'develop',
    headRefName: 'GPG-001_add_users_module',
    authorLogin: 'user2',
    state: 'OPEN',
    createdAt: '2019-09-07T08:20:10Z',
    publishedAt: '2019-09-07T08:20:10Z',
    updatedAt: '2019-09-07T11:10:33Z',
    mergedAt: '2019-09-08T11:35:24Z',
  },
  {
    title: 'GPG-002 - feat(profiles): add module',
    baseRefName: 'develop',
    headRefName: 'GPG-002_add_profiles_module',
    authorLogin: 'user2',
    state: 'OPEN',
    createdAt: '2019-09-07T09:50:10Z',
    publishedAt: '2019-09-07T09:50:10Z',
    updatedAt: '2019-09-08T16:10:31Z',
    mergedAt: '2019-09-08T16:55:14Z',
  },
  {
    title: 'GPG-003 - chore: add root files',
    baseRefName: 'develop',
    headRefName: 'GPG-003_add_root_files',
    authorLogin: 'user1',
    state: 'MERGED',
    createdAt: '2019-09-05T05:20:50Z',
    publishedAt: '2019-09-05T05:20:50Z',
    updatedAt: '2019-09-06T11:50:12Z',
    mergedAt: '2019-09-08T14:15:54Z',
  },
]

//---------------------------------
// actions
//---------------------------------

const FOCUS_PULL_REQUEST = 'app/PullRequests/FOCUS_PULL_REQUEST'

module.exports.actions = {
  FOCUS_PULL_REQUEST,
}

//---------------------------------
// action creators
//---------------------------------

const focusPullRequest = index => ({ type: FOCUS_PULL_REQUEST, payload: index })

module.exports.actionCreators = {
  focusPullRequest,
}

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {}

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
