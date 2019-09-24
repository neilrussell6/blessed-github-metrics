const { factory } = require ('factory-girl')
const R = require ('ramda')

const GithubPullRequest = require ('./github-pull-request.js')
const GithubPullRequestEvent = require ('./github-pull-request-event.js')

const factories = {
  GithubPullRequest,
  GithubPullRequestEvent,
}

const registeredFactories = R.compose (R.keys, R.prop ('factories')) (factory)

// register factories (if not already registered)
R.compose(
  R.map (f => f (factory)),
  R.pickBy ((v, k) => R.complement (R.includes) (k, registeredFactories)),
) (factories)

module.exports = factory
