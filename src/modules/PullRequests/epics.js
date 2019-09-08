const { from } = require ('rxjs')
const { map, switchMap } = require ('rxjs/operators')
const { ofType } = require ('redux-observable')

const { actions: AppActions } = require ('../App/reducer')
const { actionCreators } = require ('./reducer')

const { INIT_APP_SUCCESS } = AppActions
const { getPullRequestsSuccess } = actionCreators

//---------------------------------
// get pull requests
//---------------------------------

module.exports.getPullRequestsEpic = (action$, state$, { pullRequestsUtils }) => (
  action$.pipe (
    ofType (INIT_APP_SUCCESS),
    switchMap(() => from(pullRequestsUtils.getPullRequests())),
    map (getPullRequestsSuccess),
  )
)
