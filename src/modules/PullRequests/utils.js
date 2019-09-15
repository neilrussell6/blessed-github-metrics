const axios = require('axios')
const Bluebird = require('bluebird')

const GraphQLUtils = require('../../common/utils/graphql.utils')
const getPullRequestsQueryDoc = require('./get-pull-requests.gql')

//---------------------------------
// get pull requests
//---------------------------------

const headers = {
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

const getPullRequestsBody = {
  query: GraphQLUtils.docToString (getPullRequestsQueryDoc),
  variables: {
    repoOwner: process.env.GITHUB_ORG,
    repoName: process.env.GITHUB_REPO,
  }
}

const getPullRequests = () => Bluebird
  .resolve (axios.post (process.env.GITHUB_API_URL, JSON.stringify(getPullRequestsBody), { headers }))
  .then ((response) => {
    if (response.data.errors) {
      return Bluebird.reject (new Error (response.data.errors))
    }
    return response.data.data
  })
  .catch (e => {
    return Bluebird.reject (new Error (e.response.data))
  })

module.exports.getPullRequests = getPullRequests
