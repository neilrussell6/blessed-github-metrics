const { factory } = require ('factory-girl')
const R = require ('ramda')

const GithubPullRequest = require ('./github-pull-request')
const GithubPullRequestEvent = require ('./github-pull-request-event')
const PullRequestParticipant = require ('./pull-request-participant')

const factories = {
  GithubPullRequest,
  GithubPullRequestEvent,
  PullRequestParticipant,
}

const registeredFactories = R.compose (R.keys, R.prop ('factories')) (factory)

// register factories (if not already registered)
R.compose(
  R.map (f => f (factory)),
  R.pickBy ((v, k) => R.complement (R.includes) (k, registeredFactories)),
) (factories)

module.exports = factory
