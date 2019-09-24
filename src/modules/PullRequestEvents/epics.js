const { from } = require ('rxjs')
const { tap, take, map, switchMap, catchError } = require ('rxjs/operators')
const { ofType } = require ('redux-observable')
const R = require ('ramda')

const GraphQLUtils = require ('../../common/utils/graphql.utils')
const { SELECT_PULL_REQUEST } = require ('../PullRequest')
const getPullRequestEventsQueryDoc = require ('./get-pull-request-events.gql')

const {
  HTTP_GET_PULL_REQUEST_EVENTS,
  httpGetPullRequestEvents,
  httpGetPullRequestEventsSuccess,
  httpGetPullRequestEventsFailure,
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
// get pull request events
//---------------------------------

// TODO: move into relay
module.exports.getPullRequestEventsRelayEpic = (action$) => (
  action$.pipe (
    ofType (SELECT_PULL_REQUEST),
    map (httpGetPullRequestEvents),
  )
)

module.exports.getPullRequestEventsEpic = (action$, state$, { githubHttpUtils }) => (
  action$.pipe (
    ofType (HTTP_GET_PULL_REQUEST_EVENTS),
    // ... get selected PR branch
    switchMap (() => state$.pipe (
      take (1),
      map (R.path (['pullRequest', 'headRefName'])),
    )),
    // ... prepare request body
    map (R.assocPath (['variables', 'branch'], R.__, {})),
    map (R.mergeDeepRight ({
      query: GraphQLUtils.docToString (getPullRequestEventsQueryDoc)
    })),
    map (R.mergeDeepRight (COMMON_BODY)),
    // ... http request
    switchMap (body => from (githubHttpUtils.post ('') (body)).pipe (
      map (httpGetPullRequestEventsSuccess),
      catchError (e => of (e).pipe (
        map (R.prop ('message')),
        map (httpGetPullRequestEventsFailure),
      )),
    )),
  )
)
