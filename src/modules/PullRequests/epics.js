const { from, of } = require ('rxjs')
const { map, mapTo, switchMap, catchError } = require ('rxjs/operators')
const { ofType } = require ('redux-observable')
const R = require ('ramda')

const GraphQLUtils = require ('../../common/utils/graphql.utils')
const getPullRequestsQueryDoc = require ('./get-pull-requests.gql')
const { INIT_APP_SUCCESS } = require ('../App/reducer')
const {
  HTTP_GET_PULL_REQUESTS,
  httpGetPullRequests,
  httpGetPullRequestsSuccess,
  httpGetPullRequestsFailure,
} = require ('./reducer')

//---------------------------------
// constants
//---------------------------------

const COMMON_BODY = {
  variables: {
    repoOwner: process.env.GITHUB_ORG,
    repoName: process.env.GITHUB_REPO,
  }
}

//---------------------------------
// get pull requests
//---------------------------------

// TODO: move into relay
module.exports.getPullRequestsRelayEpic = (action$) => (
  action$.pipe (
    ofType (INIT_APP_SUCCESS),
    map (httpGetPullRequests),
  )
)

module.exports.getPullRequestsEpic = (action$, state$, { githubHttpUtils }) => (
  action$.pipe (
    ofType (HTTP_GET_PULL_REQUESTS),
    // ... prepare request body
    mapTo (GraphQLUtils.docToString (getPullRequestsQueryDoc)),
    map (R.objOf ('query')),
    map (R.mergeDeepRight (COMMON_BODY)),
    // ... http request
    switchMap (body => from (githubHttpUtils.post ('') (body)).pipe (
      map (httpGetPullRequestsSuccess),
      catchError (e => of (e).pipe (
        map (R.prop ('message')),
        map (httpGetPullRequestsFailure),
      )),
    )),
  )
)
