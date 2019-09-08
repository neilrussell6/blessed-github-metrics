const axios = require('axios')
const Bluebird = require('bluebird')

//---------------------------------
// get pull requests
//---------------------------------

const headers = {
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

const variables = {
  repoOwner: process.env.GITHUB_ORG,
  repoName: process.env.GITHUB_REPO,
}

const query = `
query($repoOwner: String!, $repoName: String!, $prCount: Int = 50) {
  repository(owner: $repoOwner, name: $repoName) {
    pullRequests(last: $prCount) {
      nodes {
        title
        baseRefName
        headRefName
        author {
          login
        }
        state
        createdAt
        publishedAt
        updatedAt
        mergedAt
      }
    }
  }
}
`

const getPullRequests = () => Bluebird
  .resolve (axios.post (process.env.GITHUB_API_URL, { query, variables }, { headers }))
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
