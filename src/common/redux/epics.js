const { catchError } = require ('rxjs/operators')
const { combineEpics } = require ('redux-observable')

const { epics: appEpics } = require ('../../modules/App')

//---------------------------------
// root epic
// setup all app epics
//---------------------------------

const epics = [
  appEpics.initAppEpic,
]

module.exports.rootEpic = (...args) => (
  combineEpics (...epics) (...args).pipe (
    catchError ((e) => {
      console.error ('Uncaught Redux Epic error', e)
    }),
  )
)
