const { catchError } = require ('rxjs/operators')
const { combineEpics } = require ('redux-observable')

const { epics: appEpics } = require ('../../modules/App')
const { epics: messageEpics } = require ('../../modules/Message')
const { epics: pullRequestsEpics } = require ('../../modules/PullRequests')
const { epics: pullRequestEventsEpics } = require ('../../modules/PullRequestEvents')

//---------------------------------
// root epic
// setup all app epics
//---------------------------------

const epics = [
  appEpics.initAppEpic,
  messageEpics.setErrorMessageEpic,
  pullRequestsEpics.getPullRequestsRelayEpic,
  pullRequestsEpics.getPullRequestsEpic,
  pullRequestEventsEpics.getPullRequestEventsRelayEpic,
  pullRequestEventsEpics.getPullRequestEventsEpic,
]

module.exports.rootEpic = (...args) => (
  combineEpics (...epics) (...args).pipe (
    catchError ((e) => {
      console.error ('Uncaught Redux Epic error', e)
    }),
  )
)
