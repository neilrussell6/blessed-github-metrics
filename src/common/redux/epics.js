const { catchError } = require ('rxjs/operators')
const { combineEpics } = require ('redux-observable')

const { epics: appEpics } = require ('../../modules/App')
const { epics: pullRequestsEpics } = require ('../../modules/PullRequests')

//---------------------------------
// root epic
// setup all app epics
//---------------------------------

const epics = [
  appEpics.initAppEpic,
  pullRequestsEpics.getPullRequestsEpic,
]

module.exports.rootEpic = (...args) => (
  combineEpics (...epics) (...args).pipe (
    catchError ((e) => {
      console.error ('Uncaught Redux Epic error', e)
    }),
  )
)
